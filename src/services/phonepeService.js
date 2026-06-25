import axios from 'axios';

/**
 * PhonePe Service supporting dynamic Admin configuration.
 * It reads credentials from LocalStorage so that Admin changes take effect immediately.
 */

const getPaymentSettings = () => {
    const saved = localStorage.getItem('oxycare_payment_settings');
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch (e) {
        console.error('Failed to parse payment settings:', e);
        return null;
    }
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export const initiatePhonePePayment = async (amount, orderId, userDetails) => {
    try {
        const settings = getPaymentSettings();
        
        if (!settings || !settings.isActive) {
            console.warn('Payment Gateway is not active in Admin settings. Falling back to COD simulation mode.');
            return { success: true, mock: true };
        }

        const activeGateway = settings.activeGateway;
        const config = settings.gateways[activeGateway];

        console.log(`Initiating ${activeGateway} Payment...`, { 
            amount, 
            orderId, 
            env: settings.env,
            merchantId: config.merchantId 
        });

        const response = await axios.post(`${BACKEND_URL}/api/payment/create`, {
            gateway: activeGateway,
            amount,
            orderId,
            userId: userDetails?.id || 'GUEST',
            phone: userDetails?.phone || '9999988888',
            credentials: {
                apiKey: config.apiKey,
                secretKey: config.secretKey,
                merchantId: config.merchantId,
                env: settings.env
            }
        }, { timeout: 15000 });

        if (response.data.success && response.data.paymentUrl) {
            // Redirect to the actual gateway payment page
            window.location.href = response.data.paymentUrl;
            return { success: true };
        } else {
            throw new Error(response.data.error || 'Payment initiation failed');
        }

    } catch (error) {
        console.error('Payment Error:', error);
        
        let errorMessage = 'Payment server is not responding. Please ensure the backend server is running.';
        
        if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'Payment request timed out. Please try again.';
        }

        return { success: false, error: errorMessage };
    }
};
