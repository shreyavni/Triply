import React, { useState, useEffect, useRef } from 'react';
import SelectionCard from '../components/SelectionCard';
import { generateRealItinerary } from '../utils/aiService';

export default function SetupPage({ user, onGenerate }) {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const [destInput, setDestInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingDest, setIsLoadingDest] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Ref to prevent the dropdown from reopening after selection
    const skipFetch = useRef(false);

    const [days, setDays] = useState('');
    const [budget, setBudget] = useState(null);
    const [companion, setCompanion] = useState(null);

    // OpenStreetMap Geocoding API with Debounce
    useEffect(() => {
        const fetchPlaces = async () => {
            if (destInput.length < 3) {
                setSuggestions([]);
                return;
            }

            // Block the API call if we just clicked a suggestion
            if (skipFetch.current) {
                skipFetch.current = false;
                return;
            }

            setIsLoadingDest(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destInput)}&format=json&addressdetails=1&limit=5&featuretype=city`);
                const data = await res.json();

                // Prioritize Indian cities to the top
                let sortedData = data.map(item => item.display_name);
                sortedData.sort((a, b) => {
                    const aIsIndia = a.toLowerCase().includes('india');
                    const bIsIndia = b.toLowerCase().includes('india');
                    if (aIsIndia && !bIsIndia) return -1;
                    if (!aIsIndia && bIsIndia) return 1;
                    return 0;
                });

                setSuggestions(sortedData);
            } catch (error) {
                console.error("Failed to fetch destinations:", error);
            } finally {
                setIsLoadingDest(false);
            }
        };

        const debounceTimer = setTimeout(fetchPlaces, 600);
        return () => clearTimeout(debounceTimer);
    }, [destInput]);

    const selectCity = (city) => {
        skipFetch.current = true;
        setDestInput(city);
        setSuggestions([]);
    };

    const budgets = [
        { id: 'cheap', emoji: '💵', title: 'Cheap', iconBg: '#84f3aaff' },
        { id: 'moderate', emoji: '💰', title: 'Moderate', iconBg: '#f4e970ff' },
        { id: 'luxury', emoji: '💎', title: 'Luxury', iconBg: '#809dfcff' }
    ];

    const companions = [
        { id: 'solo', emoji: '🚶', title: 'Just Me', desc: 'A sole traveler', iconBg: '#8df8b3ff' },
        { id: 'couple', emoji: '🥂', title: 'A Couple', desc: 'Two travelers', iconBg: '#fbaad8ff' },
        { id: 'family', emoji: '🏡', title: 'Family', desc: 'Group of adventurers', iconBg: '#84b6f7ff' },
        { id: 'friends', emoji: '🎉', title: 'Friends', desc: 'Thrill seekers', iconBg: '#efba76ff' }
    ];

    const isStepValid = (s) => {
        switch (s) {
            case 1: return destInput.trim().length > 0;
            case 2: return days > 0;
            case 3: return companion !== null;
            case 4: return budget !== null;
            default: return false;
        }
    };

    const handleGenerate = async () => {
        if (!user) {
            alert("Please Sign In first to generate a trip!");
            onLogin();
            return;
        }
        setIsGenerating(true);
        try {
            const aiItinerary = await generateRealItinerary(destInput, days, budget, companion);
            window.scrollTo(0, 0);
            onGenerate({ destination: destInput, days, budget, companion, itinerary: aiItinerary });
        } catch (error) {
            alert("AI generation failed. Check your API key in .env or check the console.");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const progress = (step / totalSteps) * 100;
    const displayName = user && !user.isAnonymous ? (user.displayName?.split(' ')[0] || 'Traveler') : 'Traveler';

    const floatingImages = [
        { src: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=100', alt: 'Paris', className: 'animate-float-1', style: { top: '15%', left: '5%', width: '200px', height: '240px', borderRadius: '16px', opacity: 1, objectFit: 'cover', transform: 'rotate(-8deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', border: '5px solid #fff' } },
        { src: 'https://images.unsplash.com/photo-1688257609244-3f2a893f19d6?q=80&w=938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'India', className: 'animate-float-2', style: { top: '65%', left: '8%', width: '200px', height: '240px', borderRadius: '16px', opacity: 1, objectFit: 'cover', transform: 'rotate(10deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', border: '5px solid #fff' } },
        { src: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=1200&q=100', alt: 'New York', className: 'animate-float-3', style: { top: '10%', right: '5%', width: '200px', height: '240px', borderRadius: '16px', opacity: 1, objectFit: 'cover', transform: 'rotate(6deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', border: '5px solid #fff' } },
        { src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=100', alt: 'India', className: 'animate-float-1', style: { top: '60%', right: '8%', width: '200px', height: '240px', borderRadius: '16px', opacity: 1, objectFit: 'cover', transform: 'rotate(-12deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', border: '5px solid #fff' } }
    ];
    return (
        <div style={{
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #17b978 100%)',
            minHeight: '100vh',
            position: 'relative',
        }}>
            {/* Soft Light Overlay for readability */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

            {/* Background Floating Images */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
                {floatingImages.map((img, idx) => (
                    <img key={idx} src={img.src} alt={img.alt} className={img.className} style={{ position: 'absolute', ...img.style }} />
                ))}
            </div>

            <div style={{
                maxHeight: "80vh",
                maxWidth: '650px',
                margin: '120px auto 0',
                padding: '100px 30px',
                position: 'relative',
                backgroundImage: 'url(/setup1.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', color: '#111827' }}>
                            Hello, {displayName}!
                        </h1>
                        <p style={{ margin: 0, color: '#01091aff', fontSize: '16px' }}>Ready to plan your next adventure?</p>
                    </div>
                </div>

                {/* Steps Content */}
                <div style={{ minHeight: '150px', position: 'relative' }}>

                    {step === 1 && (
                        <div className="fade-in-section is-visible">
                            <h2 style={{ width: '50%', fontSize: '22px', fontWeight: '800', marginBottom: '24px', color: '#111827' }}>Where do you want to go?</h2>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text" value={destInput} onChange={(e) => setDestInput(e.target.value)}
                                    placeholder="Start typing a city (e.g., Tokyo, Paris)..."
                                    style={{ width: '50%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', outline: 'none', color: '#111827' }}
                                />
                                {isLoadingDest && <p style={{ position: 'absolute', right: '16px', top: '16px', color: '#64748b', fontSize: '14px', margin: 0 }}>Searching...</p>}

                                {suggestions.length > 0 && (
                                    <ul className="custom-scrollbar" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', borderRadius: '16px', listStyle: 'none', padding: '8px 0', margin: '8px 0 0 0', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
                                        {suggestions.map((city, i) => (
                                            <li key={i} onClick={() => selectCity(city)} style={{ padding: '12px 20px', cursor: 'pointer', fontSize: '15px', color: '#111827', borderBottom: i === suggestions.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                                📍 {city}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="fade-in-section is-visible">
                            <h2 style={{ width: '50%', fontSize: '22px', fontWeight: '800', marginBottom: '24px', color: '#111827' }}>How many days are you planning your trip?</h2>
                            <input
                                type="number" value={days} onChange={(e) => setDays(e.target.value)} placeholder="Ex. 3" min="1"
                                style={{ width: '50%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', outline: 'none', color: '#111827' }}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="fade-in-section is-visible">
                            <h2 style={{ width: '50%', fontSize: '22px', fontWeight: '800', marginBottom: '24px', color: '#111827' }}>Who do you plan on traveling with?</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '500px' }}>
                                {companions.map(c => (
                                    <SelectionCard key={c.id} {...c} isSelected={companion === c.id} onClick={() => setCompanion(c.id)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="fade-in-section is-visible">
                            <h2 style={{ width: '50%', fontSize: '22px', fontWeight: '800', marginBottom: '24px', color: '#111827' }}>What is Your Budget?</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '500px' }}>
                                {budgets.map(b => (
                                    <SelectionCard key={b.id} {...b} isSelected={budget === b.id} onClick={() => setBudget(b.id)} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '16px' }}>
                    {step > 1 ? (
                        <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '16px 32px', borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#4b5563', fontWeight: '700', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                            Back
                        </button>
                    ) : <div style={{ flex: 1 }}></div>}

                    {step < totalSteps ? (
                        <button
                            disabled={!isStepValid(step)}
                            onClick={() => setStep(s => s + 1)}
                            style={{ flex: 1, padding: '15px 24px', borderRadius: '16px', border: 'none', backgroundColor: isStepValid(step) ? '#111827' : '#9ca3af', color: '#ffffff', fontWeight: '700', fontSize: '16px', cursor: isStepValid(step) ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s' }}>
                            Continue
                        </button>
                    ) : (
                        <button
                            disabled={!isStepValid(step) || isGenerating}
                            onClick={handleGenerate}
                            style={{ flex: 1, padding: '16px 32px', borderRadius: '16px', border: 'none', backgroundColor: (!isStepValid(step) || isGenerating) ? '#9ca3af' : '#111827', color: '#ffffff', fontWeight: '700', fontSize: '16px', cursor: (!isStepValid(step) || isGenerating) ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}>
                            {isGenerating ? 'Planning...' : 'Generate Trip ✨'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}   
