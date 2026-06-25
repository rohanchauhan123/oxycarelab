/**
 * PhonePe Secure Checksum Generator (Backend Example)
 * 
 * Deployment: You can host this as a Vercel/Netlify function or a simple Node server.
 * Requires: crypto, axios
 */

const crypto = require('crypto');
const axios = require('axios');

const SALT_KEY = process.env.VITE_PHONEPE_CLIENT_SECRET; // Keep this secure!
const SALT_INDEX = 1; // Default index
const MERCHANT_ID = process.env.VITE_PHONEPE_CLIENT_ID;

const API_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

async function createPayment(req, res) {
    const { amount, orderId, userId, phone } = req.body;

    const payload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: orderId,
        merchantUserId: userId,
        amount: amount * 100, // paise
        redirectUrl: "https://yourdomain.com/dashboard/bookings",
        redirectMode: "REDIRECT",
        callbackUrl: "https://yourdomain.com/api/callback",
        mobileNumber: phone,
        paymentInstrument: {
            type: "PAY_PAGE"
        }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const fullURL = base64Payload + "/pg/v1/pay" + SALT_KEY;
    const checksum = crypto.createHash('sha256').update(fullURL).digest('hex') + "###" + SALT_INDEX;

    try {
        const response = await axios.post(API_URL, { request: base64Payload }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'accept': 'application/json'
            }
        });

        res.json({
            success: true,
            paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
