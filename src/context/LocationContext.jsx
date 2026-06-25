import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState('India');
    const [coordinates, setCoordinates] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const reverseGeocode = async (lat, lon) => {
        if (!lat || !lon) return 'India';
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
                { timeout: 5000 } // Add timeout
            );
            const addr = response?.data?.address || {};
            const parts = [
                addr.road || addr.suburb || addr.neighbourhood || addr.amenity,
                addr.city || addr.town || addr.village || addr.county,
                addr.state,
                addr.postcode
            ].filter(Boolean);
            return parts.length > 0 ? parts.join(', ') : 'India';
        } catch (err) {
            console.error('Reverse Geocode Error:', err);
            return 'India'; // Return fallback instead of null
        }
    };

    // The original fetchLocationName is no longer directly used by the new getLocation
    // but keeping it as it's not explicitly removed by the instruction.
    // Removed unused fetchLocationName

    // Refactored getLocation into useCallback as per instruction
    const getLocation = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (typeof navigator !== 'undefined' && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            setCoordinates({ latitude, longitude });
                            
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 5000);

                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                                { signal: controller.signal }
                            );
                            
                            clearTimeout(timeoutId);
                            const data = await response.json();
                            const addr = data?.address || {};
                            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "Delhi";
                            setLocation(city);
                        } catch (err) {
                            console.error("Error fetching city:", err);
                        } finally {
                            setIsLoading(false);
                        }
                    },
                    (err) => {
                        console.error("Geolocation error:", err);
                        setError("Permission denied");
                        setIsLoading(false);
                    },
                    { timeout: 10000, enableHighAccuracy: false }
                );
            } else {
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Location service crash:", err);
            setIsLoading(false);
        }
    }, []); // Empty dependency array as per the provided code snippet for useCallback

    // Auto-fetch location on mount if still at default
    React.useEffect(() => {
        if (location === 'India' && !isLoading) {
            getLocation();
        }
    }, [getLocation, location, isLoading]);

    return (
        <LocationContext.Provider value={{ location, setLocation, coordinates, error, getLocation, reverseGeocode, isLoading }}>
            {children}
        </LocationContext.Provider>
    );
};
