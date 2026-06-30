export const generateMockItinerary = (destination, days, budget) => {
    const itinerary = [];
    const hotelType = budget === 'luxury' ? '5-Star Resort' : budget === 'moderate' ? 'Boutique Hotel' : 'Cozy Backpacker Hostel';

    for (let i = 1; i <= days; i++) {
        itinerary.push({
            day: i,
            activities: [
                { type: 'hotel', time: '08:00 AM', title: `Wake up at ${hotelType}`, desc: `Start your day fresh at your ${budget} accommodation.`, icon: '🛏️' },
                { type: 'meal', time: '09:00 AM', title: 'Local Breakfast Spot', desc: 'Grab some traditional morning pastries and coffee.', icon: '🥐' },
                { type: 'activity', time: '10:30 AM', title: `Explore ${destination} Landmarks`, desc: 'Take a guided walk around the most famous spots.', icon: '📸' },
                { type: 'meal', time: '01:30 PM', title: 'Authentic Lunch', desc: 'Stop by a highly-rated local restaurant for lunch.', icon: '🍜' },
                { type: 'activity', time: '03:00 PM', title: 'Hidden Gems Tour', desc: 'Discover off-the-beaten-path locations.', icon: '🗺️' },
                { type: 'meal', time: '07:30 PM', title: 'Dinner with a View', desc: 'Enjoy a relaxing dinner to wrap up the day.', icon: '🍷' },
                { type: 'hotel', time: '10:00 PM', title: 'Return to accommodation', desc: 'Rest up for tomorrow!', icon: '🌙' },
            ]
        });
    }
    return itinerary;
};

// Day color themes to change the vibe
export const dayThemes = [
    { main: '#3b82f6', bg: '#eff6ff', line: 'linear-gradient(to bottom, #3b82f6, #10b981)' }, // Blue to Emerald
    { main: '#10b981', bg: '#ecfdf5', line: 'linear-gradient(to bottom, #10b981, #f59e0b)' }, // Emerald to Amber
    { main: '#f59e0b', bg: '#fffbeb', line: 'linear-gradient(to bottom, #f59e0b, #8b5cf6)' }, // Amber to Purple
    { main: '#8b5cf6', bg: '#f5f3ff', line: 'linear-gradient(to bottom, #8b5cf6, #ec4899)' }, // Purple to Pink
    { main: '#ec4899', bg: '#fdf2f8', line: 'linear-gradient(to bottom, #ec4899, #3b82f6)' }, // Pink back to Blue
];
