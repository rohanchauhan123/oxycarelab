import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createClient as createRedisClient } from 'redis';
import NodeCache from 'node-cache';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SALT_KEY = process.env.VITE_PHONEPE_CLIENT_SECRET;
const SALT_INDEX = process.env.VITE_PHONEPE_CLIENT_VERSION || '1';
const MERCHANT_ID = process.env.VITE_PHONEPE_CLIENT_ID;
const ENV = process.env.VITE_PHONEPE_ENV || 'STAGING';

const API_URLS = {
    STAGING: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
    PRODUCTION: 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
};

// WhatsApp Business API Config
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '363638483505048';
const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Razorpay Config
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Supabase Admin Client
let supabase = null;
if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
} else {
    console.warn('Supabase URL or Service Role Key is missing. Supabase admin client not initialized.');
}

// Caching Setup
const localCache = new NodeCache({ stdTTL: 600 }); // 10 mins default
let redisClient = null;

if (process.env.REDIS_URL) {
    redisClient = createRedisClient({ url: process.env.REDIS_URL });
    redisClient.on('error', err => console.error('Redis Client Error', err));
    redisClient.connect().catch(console.error);
}

const getCache = async (key) => {
    if (redisClient?.isOpen) return await redisClient.get(key);
    return localCache.get(key);
};

const setCache = async (key, value, ttl = 600) => {
    if (redisClient?.isOpen) await redisClient.set(key, JSON.stringify(value), { EX: ttl });
    localCache.set(key, value, ttl);
};

app.get('/', (req, res) => {
    res.json({ success: true, message: "OxyCare Labs API Server is running." });
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, status: "healthy", message: "OxyCare Labs API Server is running." });
});

// ─────────────────────────────────────────────
// WHATSAPP OTP ENDPOINTS
// ─────────────────────────────────────────────

app.post('/api/otp/send', async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ error: 'Phone number is required' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

        // Store OTP in Supabase
        if (supabase) {
            const { error } = await supabase
                .from('otps')
                .upsert([{ phone, otp, expires_at: expiresAt }], { onConflict: 'phone' });
            if (error) console.error('[OTP] Supabase store error:', error.message);
        }

        // Format phone number for WhatsApp (91XXXXXXXXXX format, no + or spaces)
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

        // Send OTP via WhatsApp Cloud API
        if (WA_TOKEN) {
            const waRes = await axios.post(
                `https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: waPhone,
                    type: 'text',
                    text: {
                        body: `🏥 *OxyCare Labs*\n\nYour verification OTP is:\n\n*${otp}*\n\nValid for 10 minutes. Do not share this code with anyone.`
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${WA_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );
            console.log('[OTP] WhatsApp sent to', waPhone, '| WA Message ID:', waRes.data?.messages?.[0]?.id);
        } else {
            console.warn('[OTP] WHATSAPP_ACCESS_TOKEN not set. OTP generated but NOT sent via WhatsApp. OTP:', otp);
        }

        res.json({ success: true, message: 'OTP sent via WhatsApp successfully!' });

    } catch (error) {
        console.error('[OTP] Send error:', error.response?.data || error.message);
        const errMsg = error.response?.data?.error?.message || error.message;
        res.status(500).json({ error: `Failed to send OTP: ${errMsg}` });
    }
});

app.post('/api/otp/verify', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });

        if (!supabase) return res.status(500).json({ error: 'Database not configured on server' });

        const { data, error } = await supabase
            .from('otps')
            .select('otp, expires_at')
            .eq('phone', phone)
            .single();

        if (error || !data) {
            return res.status(400).json({ error: 'OTP not found or already used. Please request a new OTP.' });
        }

        if (new Date(data.expires_at) < new Date()) {
            await supabase.from('otps').delete().eq('phone', phone);
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (data.otp !== String(otp)) {
            return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
        }

        // OTP matched — delete it so it can't be reused
        await supabase.from('otps').delete().eq('phone', phone);
        res.json({ success: true, message: 'OTP verified successfully!' });

    } catch (error) {
        console.error('[OTP] Verify error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ─────────────────────────────────────────────
// RAZORPAY PAYMENT ENDPOINTS
// ─────────────────────────────────────────────

app.post('/api/payment/razorpay/create-order', async (req, res) => {
    try {
        const { amount, bookingId, currency = 'INR' } = req.body;
        if (!amount || !bookingId) return res.status(400).json({ error: 'Amount and bookingId are required' });

        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ error: 'Razorpay credentials not configured on server' });
        }

        const orderPayload = {
            amount: Math.round(amount * 100), // paise
            currency,
            receipt: bookingId,
            notes: { bookingId }
        };

        const rzpRes = await axios.post(
            'https://api.razorpay.com/v1/orders',
            orderPayload,
            {
                auth: { username: RAZORPAY_KEY_ID, password: RAZORPAY_KEY_SECRET },
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            }
        );

        res.json({
            success: true,
            orderId: rzpRes.data.id,
            amount: rzpRes.data.amount,
            currency: rzpRes.data.currency,
            keyId: RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('[Razorpay] Create order error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data?.error?.description || error.message });
    }
});

app.post('/api/payment/razorpay/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment verification parameters' });
        }

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Payment signature verification failed. Payment may be fraudulent.' });
        }

        // Update booking status in Supabase if bookingId provided
        if (supabase && bookingId) {
            const { data: current } = await supabase.from('bookings').select('data').eq('id', bookingId).single();
            if (current) {
                const updated = { ...current.data, status: 'Confirmed', paymentId: razorpay_payment_id, paymentMethod: 'Razorpay' };
                await supabase.from('bookings').update({ data: updated }).eq('id', bookingId);
            }
        }

        res.json({ success: true, paymentId: razorpay_payment_id, message: 'Payment verified successfully!' });

    } catch (error) {
        console.error('[Razorpay] Verify error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/payment/create', async (req, res) => {
    try {
        const { gateway, amount, orderId, userId, phone, credentials } = req.body;
        
        // Use credentials from request if provided, otherwise fallback to .env
        const activeMerchantId = credentials?.merchantId || MERCHANT_ID;
        const activeSaltKey = credentials?.secretKey || SALT_KEY;
        const activeSaltIndex = credentials?.apiKey || SALT_INDEX; // Standardized key mapping
        const activeEnv = credentials?.env || ENV;

        const payload = {
            merchantId: activeMerchantId,
            merchantTransactionId: orderId,
            merchantUserId: userId,
            amount: amount * 100, // convert to paise
            redirectUrl: `https://${req.get('host')}/order-confirmation?id=${orderId}`,
            redirectMode: "REDIRECT",
            callbackUrl: "https://oxycarelabs.com/api/callback",
            mobileNumber: phone,
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const fullURL = base64Payload + "/pg/v1/pay" + activeSaltKey;
        const checksum = crypto.createHash('sha256').update(fullURL).digest('hex') + "###" + activeSaltIndex;

        const apiUrl = activeEnv === 'PRODUCTION' ? API_URLS.PRODUCTION : API_URLS.STAGING;

        const response = await axios.post(apiUrl, {
            request: base64Payload
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'accept': 'application/json'
            }
        });

        if (response.data.success) {
            res.json({
                success: true,
                paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
            });
        } else {
            res.status(400).json({ success: false, error: response.data.message });
        }

    } catch (error) {
        console.error('PhonePe Backend Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
});

// --- DYNAMIC PRICING ENGINE ---

app.get('/api/price', async (req, res) => {
    try {
        const { type, id, city, user_type } = req.query;
        if (!type || !id || !city) return res.status(400).json({ error: 'Missing parameters' });

        const cacheKey = `price:${type}:${id}:${city}:${user_type || 'guest'}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.json(typeof cached === 'string' ? JSON.parse(cached) : cached);

        let pricingRow = null;
        let labSelected = null;

        // Step 1: Fetch pricing row (Priority Resolution)
        const table = type === 'test' ? 'test_pricing' : 'package_pricing';
        const idKey = type === 'test' ? 'test_id' : 'package_id';

        const { data: pricingData } = await supabase
            .from(table)
            .select('*')
            .eq(idKey, id)
            .eq('city', city)
            .eq('is_active', true)
            .order('selling_price', { ascending: true }); // Prefer cheaper if multiple

        if (pricingData && pricingData.length > 0) {
            pricingRow = pricingData[0];
            // Fetch lab name
            const { data: labData } = await supabase.from('labs').select('data').eq('id', pricingRow.lab_id).single();
            labSelected = labData?.data?.name || pricingRow.lab_id;
        } else {
            // Fallback to default test price (City level or Global)
            const { data: entityData } = await supabase.from(type === 'test' ? 'tests' : 'packages').select('data').eq('id', id).single();
            if (!entityData) return res.status(404).json({ error: 'Entity not found' });
            
            pricingRow = {
                lab_cost: entityData.data.price || 0,
                margin_type: 'fixed',
                margin_value: 0,
                selling_price: entityData.data.price || 0
            };
            labSelected = "Default Provider";
        }

        // Step 2: Determine base price
        let final_price = 0;
        if (pricingRow.selling_price) {
            final_price = pricingRow.selling_price;
        } else {
            if (pricingRow.margin_type === 'fixed') {
                final_price = Number(pricingRow.lab_cost) + Number(pricingRow.margin_value);
            } else {
                final_price = Number(pricingRow.lab_cost) * (1 + Number(pricingRow.margin_value) / 100);
            }
        }

        // Step 3: Apply constraints
        if (pricingRow.min_price && final_price < pricingRow.min_price) final_price = pricingRow.min_price;
        if (pricingRow.max_price && final_price > pricingRow.max_price) final_price = pricingRow.max_price;

        // Step 4: Apply pricing rules
        const { data: rules } = await supabase.from('pricing_rules').select('*').eq('is_active', true).order('priority', { ascending: false });
        const applied_rules = [];

        if (rules) {
            for (const rule of rules) {
                let conditionMet = false;
                const cond = rule.condition_json;

                if (rule.rule_type === 'time_based') {
                    const hour = new Date().getHours();
                    if (hour >= cond.start_hour && hour <= cond.end_hour) conditionMet = true;
                } else if (rule.rule_type === 'user_type' && user_type === cond.user_type) {
                    conditionMet = true;
                }

                if (conditionMet) {
                    if (rule.adjustment_type === 'increase') {
                        final_price += rule.adjustment_value;
                    } else {
                        final_price -= rule.adjustment_value;
                    }
                    applied_rules.push(rule.rule_type);
                }
            }
        }

        const response = {
            base_price: pricingRow.selling_price || pricingRow.lab_cost,
            final_price: Math.round(final_price),
            applied_rules,
            lab_selected: labSelected,
            city
        };

        await setCache(cacheKey, response);
        res.json(response);

    } catch (error) {
        console.error('Pricing Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- LAB SELECTION ENGINE ---

app.get('/api/lab/select', async (req, res) => {
    try {
        const { test_id, package_id, city } = req.query;
        const entity_id = test_id || package_id;
        const type = test_id ? 'test' : 'package';

        if (!entity_id || !city) return res.status(400).json({ error: 'Missing test_id/package_id or city' });

        const table = type === 'test' ? 'test_pricing' : 'package_pricing';
        const idKey = type === 'test' ? 'test_id' : 'package_id';

        const { data: options, error } = await supabase
            .from(table)
            .select(`*, labs(id, data)`)
            .eq(idKey, entity_id)
            .eq('city', city)
            .eq('is_active', true);

        if (error) throw error;
        if (!options || options.length === 0) return res.status(404).json({ error: 'No labs found for this city' });

        // Ranking Logic
        const ranked = options.map(opt => {
            const lab = opt.labs;
            const labData = lab.data || {};
            
            // Score = (weight_cost * lowest_cost_rank) + (weight_sla * fastest_sla_rank) + (weight_rating * rating_rank)
            // For simplicity, we'll use raw values for initial implementation
            const score = (labData.rating || 0) * 10 - (opt.lab_cost / 100); 
            
            return {
                id: lab.id,
                name: labData.name,
                cost: opt.selling_price || opt.lab_cost,
                rating: labData.rating,
                sla: labData.sla_report_time,
                score
            };
        }).sort((a, b) => b.score - a.score);

        res.json(ranked[0]);

    } catch (error) {
        console.error('Lab Selection Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin Post Routes
app.post('/api/admin/test-pricing', async (req, res) => {
    const { data, error } = await supabase.from('test_pricing').upsert(req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

app.post('/api/admin/package-pricing', async (req, res) => {
    const { data, error } = await supabase.from('package_pricing').upsert(req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

// Only start the HTTP server locally. On Vercel serverless, we export the app handler directly.
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`OxyCare Labs API Server running on port ${PORT} (${ENV} mode)`);
    });
}

export default app;
