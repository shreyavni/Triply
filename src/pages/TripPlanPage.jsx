import React, { useEffect, useRef, useState } from 'react';

// ==========================================
// 1. THEMES & DATA
// ==========================================
const dayThemes = [
    { main: '#3b82f6', bg: '#eff6ff', line: 'linear-gradient(to bottom, #3b82f6, #10b981)' }, // Blue to Emerald
    { main: '#10b981', bg: '#ecfdf5', line: 'linear-gradient(to bottom, #10b981, #f59e0b)' }, // Emerald to Amber
    { main: '#f59e0b', bg: '#fffbeb', line: 'linear-gradient(to bottom, #f59e0b, #8b5cf6)' }, // Amber to Purple
    { main: '#8b5cf6', bg: '#f5f3ff', line: 'linear-gradient(to bottom, #8b5cf6, #ec4899)' }, // Purple to Pink
    { main: '#ec4899', bg: '#fdf2f8', line: 'linear-gradient(to bottom, #ec4899, #3b82f6)' }, // Pink back to Blue
];

// ==========================================
// 2. NAVBAR COMPONENT
// ==========================================
const Navbar = ({ user, onLogin, onLogout }) => (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', cursor: 'pointer' }}>✈️ AI TripPlanner</div>
        <div>
            {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                        {user.isAnonymous ? 'Guest User' : user.displayName || 'Logged In'}
                    </span>
                    <button onClick={onLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: '600', cursor: 'pointer' }}>
                        Sign Out
                    </button>
                </div>
            ) : (
                <button onClick={onLogin} style={{ padding: '10px 22px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: '600', cursor: 'pointer' }}>
                    Sign In
                </button>
            )}
        </div>
    </nav>
);

// ==========================================
// 3. TIMELINE ITEM COMPONENT (With Google Maps)
// ==========================================
const TimelineItem = ({ item, index, theme, destination }) => {
    const [isVisible, setVisible] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);
    const domRef = useRef();

    // Scroll Fade Animation
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setVisible(true);
            });
        }, { threshold: 0.15 });

        if (domRef.current) observer.observe(domRef.current);
        return () => { if (domRef.current) observer.unobserve(domRef.current); };
    }, []);

    // Fetch Google Place Photo
    useEffect(() => {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
            // In a real local environment, this will work if the script tag is in index.html.
            // For this preview, we handle the absence of the Google API gracefully.
            return;
        }

        try {
            const dummyElement = document.createElement('div');
            const service = new window.google.maps.places.PlacesService(dummyElement);

            const searchQuery = `${item.title} ${destination}`;

            service.findPlaceFromQuery({
                query: searchQuery,
                fields: ['photos']
            }, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0] && results[0].photos) {
                    const url = results[0].photos[0].getUrl({ maxWidth: 400 });
                    setPhotoUrl(url);
                }
            });
        } catch (err) {
            console.warn("Google Maps Places API error:", err);
        }
    }, [item.title, destination]);

    const isLeft = index % 2 === 0;

    // Google Maps Search URL
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' ' + destination)}`;

    return (
        <div
            ref={domRef}
            style={{
                display: 'flex',
                justifyContent: isLeft ? 'flex-start' : 'flex-end',
                width: '100%',
                position: 'relative',
                marginBottom: '40px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : 'translateY(30px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                willChange: 'opacity, visibility'
            }}
        >
            <div style={{
                position: 'absolute', left: '50%', top: '20px', transform: 'translate(-50%, -50%)',
                width: '24px', height: '24px', borderRadius: '50%', backgroundColor: theme.main,
                border: '4px solid #fff', boxShadow: `0 0 10px ${theme.main}80`, zIndex: 5,
            }}></div>

            <div style={{
                width: '45%', padding: '24px', backgroundColor: '#fff', borderRadius: '16px',
                borderTop: `6px solid ${theme.main}`, boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                position: 'relative', marginLeft: isLeft ? '0' : '5%', marginRight: isLeft ? '5%' : '0',
            }}>

                {/* Clickable Google Image Placeholder (Falls back to generic if Google API isn't loaded) */}
                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f1f5f9', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {photoUrl ? (
                        <img
                            src={photoUrl}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    ) : (
                        <div style={{ color: '#94a3b8', textAlign: 'center' }}>
                            <span style={{ fontSize: '24px' }}>🗺️</span>
                            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Click to view on Google Maps</p>
                        </div>
                    )}
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '28px', backgroundColor: theme.bg, padding: '12px', borderRadius: '12px' }}>
                        {item.icon}
                    </div>
                    <div>
                        <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a', cursor: 'pointer' }}>{item.title}</h4>
                        </a>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: theme.main }}>{item.time}</span>
                    </div>
                </div>
                <p style={{ margin: 0, color: '#475569', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
        </div>
    );
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
export default function TripPlanPage({ tripData, user, onLogin, onLogout }) {
    // If no trip data is passed down (e.g., viewing this component in isolation),
    // we provide mock data based on your Kanpur/JK Temple request to test the UI!
    const activeData = tripData || {
        destination: "Kanpur, Uttar Pradesh",
        days: 2,
        budget: "moderate",
        companion: "family",
        itinerary: [
            {
                day: 1,
                activities: [
                    { type: "hotel", time: "08:00 AM", title: "The Landmark Hotel", desc: "Check-in to your comfortable accommodation and freshen up.", icon: "🛏️" },
                    { type: "activity", time: "10:30 AM", title: "JK Temple", desc: "Visit this beautiful Hindu temple, a unique blend of ancient and modern architecture built with high roofs for adequate ventilation.", icon: "📸" },
                    { type: "meal", time: "01:30 PM", title: "Z Square Mall", desc: "Enjoy a hearty lunch and do some light shopping in the heart of the city.", icon: "🍜" },
                    { type: "meal", time: "08:00 PM", title: "Little Chef Restaurant", desc: "Enjoy a wonderful family dinner.", icon: "🍷" }
                ]
            },
            {
                day: 2,
                activities: [
                    { type: "activity", time: "09:30 AM", title: "Allen Forest Zoo", desc: "Spend the morning exploring the local wildlife.", icon: "🦁" },
                    { type: "meal", time: "02:00 PM", title: "Thaggu Ke Ladoo", desc: "Grab some of Kanpur's most famous traditional sweets.", icon: "🍩" },
                    { type: "activity", time: "04:00 PM", title: "Moti Jheel", desc: "Relax by the lake and enjoy the scenic evening views before heading back.", icon: "🌅" }
                ]
            }
        ]
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
            {/* Central Line for the Timeline */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '4px', transform: 'translateX(-50%)', background: '#cbd5e1', borderRadius: '4px', zIndex: 0 }}></div>

            <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />

            {/* Header */}
            <div style={{ paddingTop: '120px', paddingBottom: '40px', textAlign: 'center', backgroundColor: '#0f172a', color: '#fff', position: 'relative', zIndex: 1 }}>
                <h1 style={{ fontSize: '42px', margin: '0 0 16px 0' }}>Your Epic Journey to {activeData.destination.split(',')[0]}</h1>
                <p style={{ fontSize: '18px', color: '#94a3b8' }}>
                    {activeData.days} Days • {activeData.budget.charAt(0).toUpperCase() + activeData.budget.slice(1)} Budget • Traveling as {activeData.companion}
                </p>
            </div>

            {/* Timeline Section */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', position: 'relative', zIndex: 1 }}>
                {activeData.itinerary.map((dayData, index) => {
                    const theme = dayThemes[index % dayThemes.length];

                    return (
                        <div key={`day-${dayData.day}`} style={{ marginBottom: '80px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <div style={{ display: 'inline-block', backgroundColor: theme.bg, padding: '12px 32px', borderRadius: '30px', border: `2px solid ${theme.main}` }}>
                                    <h2 style={{ margin: 0, color: theme.main, fontSize: '24px' }}>Day {dayData.day}</h2>
                                </div>
                            </div>

                            <div className="timeline-container" style={{ position: 'relative', padding: '20px 0' }}>
                                {dayData.activities.map((act, idx) => (
                                    <TimelineItem
                                        key={`act-${idx}`}
                                        item={act}
                                        index={idx}
                                        theme={theme}
                                        destination={activeData.destination}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}