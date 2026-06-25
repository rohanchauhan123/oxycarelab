/**
 * Utility for managing diagnostic test time slots.
 * Filters out past slots for the current day to prevent invalid bookings.
 */

export const STANDARD_SLOTS = [
    "06:30 AM to 07:30 AM",
    "07:30 AM to 08:30 AM",
    "08:30 AM to 09:30 AM",
    "09:30 AM to 10:30 AM",
    "10:30 AM to 11:30 AM",
    "11:30 AM to 12:30 PM",
    "12:30 PM to 01:30 PM",
    "01:30 PM to 02:30 PM",
    "02:30 PM to 03:30 PM"
];

/**
 * Returns available slots for a given date.
 * If date is today, filters out slots that have already started.
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {string[]} Filtered slots
 */
export const getAvailableSlots = (dateStr, customSlots = STANDARD_SLOTS) => {
    if (!dateStr) return [];

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // If date is in the future, all slots are available
    if (dateStr > today) {
        return customSlots;
    }

    // If date is in the past, no slots are available (sanity check)
    if (dateStr < today) {
        return [];
    }

    // If date is today, filter based on current time
    // We add a 30-minute buffer (you can't book a slot starting in the next 30 mins)
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeInMins = currentHour * 60 + currentMin + 30;

    return customSlots.filter(slot => {
        // Parse start time from format "HH:MM AM to ..."
        const startTimePart = slot.split(' to ')[0];
        if (!startTimePart) return true; // Safety fallback
        
        const [time, period] = startTimePart.split(' ');
        if (!time || !period) return true;

        let [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return true;

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const slotStartTimeInMins = hours * 60 + minutes;
        return slotStartTimeInMins > currentTimeInMins;
    });
};
