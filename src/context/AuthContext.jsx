import React, { createContext, useContext, useState } from 'react';
import db from '../services/db';
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

    const login = async (identifier, password) => {
        setIsLoading(true);
        try {
            const id = identifier.toLowerCase();

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
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('oxycare_user', JSON.stringify(userData));
                return userData;
            }

            // IndexedDB Lookup
            const savedUsers = await db.users.toArray();
            const foundUser = savedUsers.find(u =>
                (u.email?.toLowerCase() === id || u.phone?.replace(/[^0-9]/g, '') === id.replace(/[^0-9]/g, '')) &&
                u.password === password
            );

            if (foundUser) {
                setUser(foundUser);
                setIsAuthenticated(true);
                localStorage.setItem('oxycare_user', JSON.stringify(foundUser));
                return foundUser;
            }

            // Demo fallback
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
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('oxycare_user', JSON.stringify(userData));
                return userData;
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
            const savedUsers = await db.users.toArray();
            if (savedUsers.some(u => u.phone === formData.phone || u.email === formData.email)) {
                throw new Error('User already exists');
            }

            const avatarUrl = `https://api.dicebear.com/7.x/big-smile/svg?seed=${formData.name}`;

            const userData = {
                id: 'USER-' + Date.now(),
                ...formData,
                role: 'Customer',
                joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                avatar: avatarUrl,
                addresses: []
            };

            await db.users.add(userData);
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('oxycare_user', JSON.stringify(userData));
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
        await db.users.where('id').equals(newUserData.id).modify(updatedData);

        // Sync to active bookings if name or phone changed
        if (updatedData.name || updatedData.phone) {
            const bookingUpdate = {};
            if (updatedData.phone) bookingUpdate.phone = updatedData.phone;
            if (updatedData.name) bookingUpdate.userName = updatedData.name;

            // Apply updates to bookings that are not completed or cancelled
            await db.bookings
                .where('userId').equals(newUserData.id)
                .filter(b => !['Report completed', 'Cancelled'].includes(b.status))
                .modify(b => {
                    if (updatedData.phone) b.phone = updatedData.phone;
                    if (updatedData.name) {
                        b.userName = updatedData.name;
                        // Also update patient name if it's a 'Self' booking
                        if (b.patientRelation === 'Self') {
                            b.patientName = updatedData.name;
                        }
                    }
                });
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
