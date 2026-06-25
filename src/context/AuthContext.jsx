import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../services/supabase';
import * as otpService from '../services/otpService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('oxycare_user');
            if (saved) {
                const parsed = JSON.parse(saved);
                return (parsed && typeof parsed === 'object') ? parsed : null;
            }
        } catch (error) {
            console.error('Failed to parse saved user:', error);
            localStorage.removeItem('oxycare_user');
        }
        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => !!user);
    const [isLoading, setIsLoading] = useState(false);

    const _saveUser = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('oxycare_user', JSON.stringify(userData));
    };

    const login = async (identifier, password) => {
        setIsLoading(true);
        try {
            const id = identifier.toLowerCase().trim();

            // Admin credentials (hardcoded bypass)
            if (id === 'admin@oxycare.com' && password === 'admin123') {
                const userData = {
                    id: 'ADMIN-01',
                    name: 'System Admin',
                    email: identifier,
                    role: 'Super Admin',
                    joined: '01 Jan, 2026',
                    avatar: 'https://i.pravatar.cc/150?img=12'
                };
                _saveUser(userData);
                return userData;
            }

            // Demo user fallback
            if ((id === 'user@oxycare.com' || id === '9999988888') && password === 'user123') {
                const userData = {
                    id: 'USER-DEMO',
                    name: 'Demo User',
                    email: 'user@oxycare.com',
                    phone: '+91 9999988888',
                    role: 'Customer',
                    joined: '16 Feb, 2026',
                    avatar: 'https://i.pravatar.cc/150?img=32',
                    addresses: []
                };
                _saveUser(userData);
                return userData;
            }

            // Supabase lookup (replaces IndexedDB)
            const { data: rows, error } = await supabase
                .from('users')
                .select('id, data')
                .limit(500);

            if (!error && rows) {
                const foundRow = rows.find(row => {
                    const u = row.data || {};
                    const emailMatch = u.email?.toLowerCase() === id;
                    const phoneMatch = u.phone?.replace(/[^0-9]/g, '') === id.replace(/[^0-9]/g, '');
                    return (emailMatch || phoneMatch) && u.password === password;
                });

                if (foundRow) {
                    const userData = { id: foundRow.id, ...foundRow.data };
                    _saveUser(userData);
                    return userData;
                }
            }

            throw new Error('Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    // OTP LOGIC
    const sendOTP = async (phone) => {
        setIsLoading(true);
        try {
            return await otpService.sendOTP(phone);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async (phone, otp) => {
        setIsLoading(true);
        try {
            return await otpService.verifyOTP(phone, otp);
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (formData) => {
        setIsLoading(true);
        try {
            // Check if user already exists in Supabase
            const { data: rows } = await supabase
                .from('users')
                .select('id, data')
                .limit(500);

            if (rows) {
                const exists = rows.some(row => {
                    const u = row.data || {};
                    return u.phone === formData.phone || u.email === formData.email;
                });
                if (exists) throw new Error('User already exists with this phone or email');
            }

            const avatarUrl = `https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(formData.name)}`;
            const userId = 'USER-' + Date.now();
            const userData = {
                id: userId,
                ...formData,
                role: 'Customer',
                joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                avatar: avatarUrl,
                addresses: []
            };

            // Save to Supabase users table
            const { id: _, ...dataObj } = userData;
            await supabase.from('users').insert([{ id: userId, data: dataObj }]);

            _saveUser(userData);
            return userData;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('oxycare_user');
    };

    const updateProfile = async (updatedData) => {
        const newUserData = { ...user, ...updatedData };
        setUser(newUserData);
        localStorage.setItem('oxycare_user', JSON.stringify(newUserData));

        // Sync to Supabase
        try {
            const { data: current } = await supabase
                .from('users')
                .select('data')
                .eq('id', String(user.id))
                .single();

            if (current) {
                const merged = { ...current.data, ...updatedData };
                await supabase.from('users').update({ data: merged }).eq('id', String(user.id));
            }
        } catch (e) {
            console.error('Failed to sync profile to Supabase:', e);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            login,
            signup,
            logout,
            updateProfile,
            sendOTP,
            verifyOTP
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
