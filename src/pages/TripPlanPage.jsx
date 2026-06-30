import React, { useEffect, useRef, useState } from 'react';

const responsiveStyles = `
    .timeline-card {
        flex-direction: row;
        align-items: center;
    }
    .timeline-img-main {
        width: 160px;
        height: 120px;
        flex-shrink: 0;
    }
    .timeline-img-map {
        width: 120px;
        height: 120px;
        flex-shrink: 0;
        display: block;
    }
    @media (max-width: 768px) {
        .timeline-card {
            flex-direction: column !important;
            align-items: flex-start !important;
        }
        .timeline-img-main {
            width: 100% !important;
            height: 160px !important;
            margin-bottom: 8px;
        }
        .timeline-img-map {
            display: none !important;
        }
    }
`;

// ==========================================
// 1. THEMES & DATA
// ==========================================
const dayThemes = [
    { main: '#0284c7', bg: '#e0f2fe' }, // Light Blue
    { main: '#0f766e', bg: '#ccfbf1' }, // Teal
    { main: '#b45309', bg: '#fef3c7' }, // Amber
    { main: '#6d28d9', bg: '#ede9fe' }, // Purple
    { main: '#be185d', bg: '#fce7f3' }, // Pink
];

// ─── Fallback images by type (permanent Unsplash direct URLs) ───────────────
const getFallbackImage = (type, seed) => {
    // Generate a unique fallback image using the seed (title) so they don't repeat
    const hash = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    if (type === 'background') return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80';
    return `https://picsum.photos/seed/${hash}/600/400`;
};

// ─── Multi-source image fetcher ───────────────────────────────────────────────
async function fetchPlaceImage(placeName, destination, type) {
    if (!placeName) return null;
    const cleanName = placeName.split(',')[0].trim();
    const unsplashKey = import.meta.env.VITE_UNSPLASH_API_KEY;
    const cseKey    = import.meta.env.VITE_GOOGLE_CSE_KEY;
    const cseId     = import.meta.env.VITE_GOOGLE_CSE_ID;
    const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;

    // ── Source 1: Unsplash ────────────────────────────
    if (unsplashKey) {
        try {
            const q = type === 'background' ? `${cleanName} landscape city` : `${cleanName} ${destination}`;
            const res = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&client_id=${unsplashKey}&per_page=3&orientation=landscape`
            );
            const data = await res.json();
            if (data.results?.length > 0) {
                return data.results[0].urls.regular;
            }
        } catch (_) { /* fall through */ }
    }

    // ── Source 2: Google Custom Search ────────────────
    if (cseKey && cseId) {
        try {
            const q = type === 'background' ? `${cleanName} cityscape landscape photo` : `${cleanName} ${destination} photo`;
            const res = await fetch(
                `https://www.googleapis.com/customsearch/v1` +
                `?key=${cseKey}&cx=${cseId}` +
                `&q=${encodeURIComponent(q)}` +
                `&searchType=image&imgType=photo&imgSize=large` +
                `&safe=active&num=3`
            );
            const data = await res.json();
            const hit = data.items?.find(item => {
                const url = item.link || '';
                const w   = item.image?.width  || 0;
                const h   = item.image?.height || 0;
                return (
                    w >= 400 && h >= 250 &&       
                    w >= h &&                      
                    !url.includes('logo') &&
                    !url.includes('icon') &&
                    !url.includes('flag') &&
                    !url.endsWith('.svg')
                );
            });
            if (hit) return hit.link;
        } catch (_) { /* fall through */ }
    }

    // ── Source 3: Wikipedia ───────────────────────────
    // Searches full place name + destination first for max accuracy using full-text search
    for (const term of [`${cleanName} ${destination}`, cleanName, destination]) {
        try {
            const res = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query` +
                `&generator=search&gsrsearch=${encodeURIComponent(term)}` +
                `&gsrlimit=3&prop=pageimages&pithumbsize=800&format=json&origin=*`
            );
            const imgData = await res.json();
            if (imgData.query?.pages) {
                const pages = Object.values(imgData.query.pages);
                const hit = pages.find(p =>
                    p.thumbnail?.source &&
                    !p.thumbnail.source.includes('Flag_of') &&
                    !p.thumbnail.source.includes('coat_of_arms') &&
                    !p.thumbnail.source.endsWith('.svg')
                );
                if (hit) return hit.thumbnail.source;
            }
        } catch (_) { /* try next */ }
    }

    // ── Source 4: Pixabay ─────────────────────────────
    if (pixabayKey) {
        try {
            let query = `${cleanName} ${destination}`;
            if (type === 'background') query = `${cleanName} landscape city`;
            
            const category = (type === 'background' ? 'places' : 'travel');
            const res = await fetch(
                `https://pixabay.com/api/?key=${pixabayKey}` +
                `&q=${encodeURIComponent(query)}` +
                `&image_type=photo&orientation=horizontal` +
                `&category=${category}&min_width=800&safesearch=true&per_page=5`
            );
            const data = await res.json();
            if (data.hits?.length > 0) {
                const best = data.hits.reduce((a, b) => a.views > b.views ? a : b);
                return type === 'background' ? best.largeImageURL : best.webformatURL;
            }
        } catch (_) { /* fall through */ }
    }

    return null;
}

// ==========================================
// 2. NAVBAR COMPONENT (Removed - now global)
// ==========================================

// Helper to generate mock tags based on description
const generateTags = (desc) => {
    const tags = [];
    const d = desc.toLowerCase();
    
    if (d.includes('history') || d.includes('fort') || d.includes('palace') || d.includes('temple') || d.includes('museum')) tags.push('History');
    if (d.includes('walk') || d.includes('stroll') || d.includes('explore')) tags.push('Walking');
    if (d.includes('view') || d.includes('sunset') || d.includes('photo') || d.includes('panoramic')) tags.push('Sights');
    if (d.includes('shop') || d.includes('bazaar') || d.includes('market')) tags.push('Shopping');
    if (d.includes('art') || d.includes('architecture') || d.includes('ruins')) tags.push('Culture');
    if (tags.length === 0) tags.push('Exploring');
    
    return tags.slice(0, 2);
};

// ==========================================
// 3. TIMELINE ITEM COMPONENT (Redesigned)
// ==========================================
const TimelineItem = ({ item, index, theme, destination, isLast }) => {
    const [isVisible, setVisible] = useState(false);
    const fallback = getFallbackImage(item.type, item.title);
    const [photoUrl, setPhotoUrl] = useState(fallback);
    const [imgLoaded, setImgLoaded] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) setVisible(true); }),
            { threshold: 0.1 }
        );
        if (domRef.current) observer.observe(domRef.current);
        return () => { if (domRef.current) observer.unobserve(domRef.current); };
    }, []);

    useEffect(() => {
        let cancelled = false;
        fetchPlaceImage(item.title, destination, item.type).then(url => {
            if (!cancelled && url) {
                setImgLoaded(false);
                setPhotoUrl(url);
            }
        });
        return () => { cancelled = true; };
    }, [item.title, destination, item.type]);

    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' ' + destination)}`;
    const tags = generateTags(item.desc);

    return (
        <div
            ref={domRef}
            style={{
                display: 'flex',
                position: 'relative',
                marginBottom: '40px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : 'translateY(40px)',
                transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
            }}
        >
            {/* Timeline Left Column */}
            <div style={{ width: '80px', flexShrink: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Dashed Line */}
                {!isLast && (
                    <div style={{ position: 'absolute', top: '45px', bottom: '-40px', left: '50%', width: '2px', transform: 'translateX(-50%)', borderLeft: '2px dashed rgba(255,255,255,0.4)', zIndex: 0 }} />
                )}
                
                {/* Icon/Dot Circle */}
                <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: theme.bg, 
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    border: `2px solid ${theme.main}`, zIndex: 1, marginTop: '10px',
                    fontSize: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                    {item.icon}
                </div>
                {/* Time */}
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#1e293b', marginTop: '8px', textAlign: 'center', background: 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: '4px' }}>
                    {item.time}
                </div>
            </div>

            {/* Card Content Right Column */}
            <div className="timeline-card" style={{
                flexGrow: 1, marginLeft: '15px', backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px', padding: '16px', display: 'flex', gap: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.6)', position: 'relative', overflow: 'hidden'
            }}>
                {/* Type badge */}
                <span style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: theme.main, color: '#fff',
                    fontSize: '11px', fontWeight: '600', padding: '4px 12px',
                    borderRadius: '20px', backdropFilter: 'blur(4px)',
                    zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                    📍 Attraction
                </span>

                {/* Main Image */}
                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="timeline-img-main" style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'block', zIndex: 1 }}>
                    {!imgLoaded && (
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                    )}
                    <img
                        src={photoUrl}
                        alt={item.title}
                        onLoad={() => setImgLoaded(true)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
                    />
                </a>

                {/* Text Details */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', position: 'relative', zIndex: 5 }}>
                    <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700', cursor: 'pointer' }}>
                            {item.title}
                        </h4>
                    </a>
                    <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px', lineHeight: '1.4' }}>
                        {item.desc}
                    </p>
                    
                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {tags.map((tag, i) => (
                            <span key={i} style={{ 
                                fontSize: '11px', fontWeight: '600', color: theme.main, 
                                backgroundColor: theme.bg, padding: '4px 10px', borderRadius: '12px' 
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Secondary Map Placeholder Image */}
                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="timeline-img-map" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
                     <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80" alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.95)' }} />
                     {/* Magnifying glass icon overlay */}
                     <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                         <span style={{ fontSize: '14px' }}>🔍</span>
                     </div>
                </a>
            </div>
        </div>
    );
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
export default function TripPlanPage({ tripData, user }) {
    const activeData = tripData || {
        destination: "Rome, Italy",
        days: 2,
        budget: "moderate",
        companion: "family",
        itinerary: [
            {
                day: 1,
                activities: [
                    { type: "activity", time: "09:00 AM", title: "Colosseum & Roman Forum",  desc: "Explore the majestic amphitheatres and ruins. Duration: 3h.", icon: "🏛️" },
                    { type: "activity", time: "01:30 PM", title: "Trevi Fountain",           desc: "Throw a coin, explore narrow streets. Duration: 2h.",           icon: "⛲" },
                    { type: "activity", time: "04:00 PM", title: "Spanish Steps",            desc: "Climb the famous steps and enjoy the bustling square.",         icon: "🚶" },
                    { type: "activity", time: "06:30 PM", title: "Pincio Hill",              desc: "Panoramic views and sunset walk overlooking the city.",         icon: "🌅" },
                ]
            },
            {
                day: 2,
                activities: [
                    { type: "activity", time: "09:30 AM", title: "Vatican Museums",         desc: "Marvel at the Sistine Chapel and Renaissance art.",             icon: "⛪" },
                    { type: "activity", time: "01:30 PM", title: "St. Peter's Basilica",    desc: "Visit the largest church in the world.",                        icon: "🏛️" },
                    { type: "activity", time: "04:00 PM", title: "Pantheon",                desc: "Ancient Roman temple with its famous architectural dome.",      icon: "🏛️" },
                    { type: "activity", time: "06:00 PM", title: "Piazza Navona",           desc: "Enjoy the beautiful fountains and street artists.",             icon: "🎨" },
                ]
            }
        ]
    };

    const cleanItinerary = activeData.itinerary.map(day => ({
        ...day,
        activities: day.activities.filter(act => act.type !== 'hotel'),
    }));

    const destinationName = activeData.destination.split(',')[0];
    const [bgImage, setBgImage] = useState(getFallbackImage('background', ''));
    const [activeDay, setActiveDay] = useState(1);

    // Fetch background image for the destination
    useEffect(() => {
        fetchPlaceImage(destinationName, destinationName, 'background').then(url => {
            if (url) setBgImage(url);
        });
    }, [destinationName]);

    return (
        <div style={{ 
            minHeight: '100vh', position: 'relative', overflowX: 'hidden',
            backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
        }}>
            <style>{responsiveStyles}</style>
            {/* Dark overlay for readability */}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 0 }} />

            {/* Header Content */}
            <div style={{ paddingTop: '120px', paddingBottom: '20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', color: '#fff', fontWeight: '800', textShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
                    {destinationName} Adventures
                </h1>
                <p style={{ fontSize: '18px', color: '#f8fafc', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {activeData.days} Days • {activeData.budget.charAt(0).toUpperCase() + activeData.budget.slice(1)} • {activeData.companion}
                </p>
            </div>

            {/* Main Glassmorphic Container */}
            <div style={{ 
                maxWidth: '900px', margin: '20px auto 80px', padding: '30px 40px', position: 'relative', zIndex: 1,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', // Safari support
                borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}>
                
                {/* Day Tabs */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
                    {cleanItinerary.map((dayData, idx) => {
                        const theme = dayThemes[idx % dayThemes.length];
                        const isActive = activeDay === dayData.day;
                        return (
                            <button 
                                key={dayData.day}
                                onClick={() => setActiveDay(dayData.day)}
                                style={{
                                    padding: '10px 24px', borderRadius: '30px', fontWeight: '700', fontSize: '14px',
                                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s',
                                    border: isActive ? `none` : '1px solid rgba(255,255,255,0.4)',
                                    backgroundColor: isActive ? theme.main : 'rgba(255,255,255,0.15)',
                                    color: isActive ? '#fff' : '#fff',
                                    boxShadow: isActive ? `0 4px 15px ${theme.main}60` : 'none',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>{isActive ? '☀️' : '🌙'}</span>
                                DAY {dayData.day}
                            </button>
                        );
                    })}
                </div>

                {/* Timeline Content (Only show active day) */}
                <div style={{ position: 'relative' }}>
                    {cleanItinerary.filter(d => d.day === activeDay).map((dayData) => {
                        const theme = dayThemes[(dayData.day - 1) % dayThemes.length];
                        return (
                            <div style={{ position: 'relative', marginTop: '20px' }}>
                                {activeData.itinerary[activeDay - 1].activities.map((item, index) => (
                                    <TimelineItem 
                                        key={index} 
                                        item={item} 
                                        index={index} 
                                        theme={dayThemes[(activeDay - 1) % dayThemes.length]} 
                                        destination={destinationName}
                                        isLast={index === activeData.itinerary[activeDay - 1].activities.length - 1}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}