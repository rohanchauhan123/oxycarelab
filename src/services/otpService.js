/**
 * Supabase-backed OTP Service for OxyCare Labs
 * Uses the 'otps' table in Supabase so OTPs survive across serverless function restarts.
 * Table schema:
 *   CREATE TABLE IF NOT EXISTS otps (
 *     phone TEXT PRIMARY KEY,
 *     otp TEXT NOT NULL,
 *     expires_at TIMESTAMPTZ NOT NULL,
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 *   ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "allow all" ON otps FOR ALL USING (true) WITH CHECK (true);
 */

import { supabase } from './supabase';

// Fallback in-memory store if Supabase is not configured (local dev mode)
const otpMemory = new Map();

const isSupabaseConfigured = () => {
    const url = import.meta.env?.VITE_SUPABASE_URL;
    return url && url !== '' && !url.includes('placeholder');
};

export const sendOTP = async (phoneNumber) => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min expiry

    if (isSupabaseConfigured()) {
        // Upsert into Supabase so repeated sends update the record
        const { error } = await supabase
            .from('otps')
            .upsert([{ phone: phoneNumber, otp, expires_at: expiresAt }], { onConflict: 'phone' });

        if (error) {
            console.error('[OTP SERVICE] Supabase upsert failed:', error);
            // Fallback to memory store
            otpMemory.set(phoneNumber, { otp, expiry: Date.now() + 10 * 60 * 1000 });
        }
    } else {
        otpMemory.set(phoneNumber, { otp, expiry: Date.now() + 10 * 60 * 1000 });
    }

    console.log(`[OTP SERVICE] Generated OTP ${otp} for ${phoneNumber}`);

    // Simulate network delay (replace this with actual SMS gateway call in prod)
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve({ success: true, message: 'OTP sent successfully!', otp }); // Remove 'otp' from response in production
        }, 1000)
    );
};

export const verifyOTP = async (phoneNumber, userOtp) => {
    if (isSupabaseConfigured()) {
        const { data, error } = await supabase
            .from('otps')
            .select('otp, expires_at')
            .eq('phone', phoneNumber)
            .single();

        if (error || !data) {
            // Try memory fallback
            const memRecord = otpMemory.get(phoneNumber);
            if (!memRecord) throw new Error('OTP not found or expired. Please resend.');
            if (Date.now() > memRecord.expiry) {
                otpMemory.delete(phoneNumber);
                throw new Error('OTP has expired. Please request a new one.');
            }
            if (memRecord.otp !== userOtp) throw new Error('Invalid OTP. Please try again.');
            otpMemory.delete(phoneNumber);
            return { success: true };
        }

        if (new Date(data.expires_at) < new Date()) {
            await supabase.from('otps').delete().eq('phone', phoneNumber);
            throw new Error('OTP has expired. Please request a new one.');
        }

        if (data.otp !== userOtp) {
            throw new Error('Invalid OTP. Please try again.');
        }

        // Delete used OTP
        await supabase.from('otps').delete().eq('phone', phoneNumber);
        return { success: true };
    } else {
        // Memory fallback
        const record = otpMemory.get(phoneNumber);
        if (!record) throw new Error('OTP not found or expired. Please resend.');
        if (Date.now() > record.expiry) {
            otpMemory.delete(phoneNumber);
            throw new Error('OTP has expired. Please request a new one.');
        }
        if (record.otp !== userOtp) throw new Error('Invalid OTP. Please try again.');
        otpMemory.delete(phoneNumber);
        return { success: true };
    }
};
