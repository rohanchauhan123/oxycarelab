/**
 * Simulated OTP Service for OxyCare Labs
 * For production, integrate with MSG91, Twilio, or Firebase Auth.
 */

const otpDatabase = new Map();

export const sendOTP = async (phoneNumber) => {
    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store it with a 5-minute expiry
    otpDatabase.set(phoneNumber, {
        otp,
        expiry: Date.now() + 5 * 60 * 1000
    });

    console.log(`[OTP SERVICE] Sent OTP ${otp} to ${phoneNumber}`);
    
    // Simulate network delay
    return new Promise((resolve) => setTimeout(() => {
        // In a real app, you'd call an SMS gateway API here.
        resolve({ success: true, message: 'OTP sent successfully!' });
    }, 1000));
};

export const verifyOTP = async (phoneNumber, userOtp) => {
    const record = otpDatabase.get(phoneNumber);
    
    if (!record) {
        throw new Error('OTP not found or expired. Please resend.');
    }

    if (Date.now() > record.expiry) {
        otpDatabase.delete(phoneNumber);
        throw new Error('OTP has expired. Please request a new one.');
    }

    if (record.otp !== userOtp) {
        throw new Error('Invalid OTP. Please try again.');
    }

    // Success - delete it so it can't be reused
    otpDatabase.delete(phoneNumber);
    return { success: true };
};
