/* eslint-env node */
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5001;

// Base Endpoint for PhonePe
const PHONEPE_ENDPOINTS = {
    sandbox: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
    production: 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
};

app.post('/api/payment/create', async (req, res) => {
    try {
        const { gateway, amount, orderId, userId, phone, credentials } = req.body;

        if (gateway === 'phonepe') {
            const { apiKey, secretKey, merchantId, env } = credentials;
            const endpoint = PHONEPE_ENDPOINTS[env] || PHONEPE_ENDPOINTS.sandbox;

            // Payload Construction
            const payload = {
                merchantId: merchantId,
                merchantTransactionId: orderId,
                merchantUserId: userId,
                amount: amount * 100, // PhonePe takes amount in Paise
                redirectUrl: `http://localhost:5173/dashboard/bookings?order=${orderId}`, // Replace with your frontend URL
                redirectMode: 'REDIRECT',
                callbackUrl: `http://localhost:5173/api/webhook`, // Replace with your webhook
                mobileNumber: phone,
                paymentInstrument: {
                    type: 'PAY_PAGE'
                }
            };

            const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
            const SHA256_STRING = base64Payload + "/pg/v1/pay" + secretKey;
            const checksum = crypto.createHash('sha256').update(SHA256_STRING).digest('hex') + "###" + apiKey;

            console.log(`[PHONEPE] Initiating payment for Order ${orderId}...`);

            const response = await axios.post(endpoint, {
                request: base64Payload
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                    'accept': 'application/json'
                }
            });

            if (response.data.success) {
                return res.json({ 
                    success: true, 
                    paymentUrl: response.data.data.instrumentResponse.redirectInfo.url 
                });
            } else {
                return res.status(400).json({ success: false, error: response.data.message });
            }
        }

        // Add other gateways (Razorpay, Paytm) logic here if needed.
        res.status(400).json({ success: false, error: 'Unsupported Gateway' });

    } catch (error) {
        console.error('SERVER ERROR:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data?.message || 'Internal Server Error' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`OxyCare Payment Server running on http://localhost:${PORT}`);
    console.log(`To use real payments, ensure your Admin credentials match the ${PHONEPE_ENDPOINTS.sandbox} environment.`);
});
