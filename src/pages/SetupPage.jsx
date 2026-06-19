import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SelectionCard from '../components/SelectionCard';
import { generateRealItinerary } from '../utils/aiService';

export default function SetupPage({ user, onLogin, onLogout, onGenerate }) {
    const [destInput, setDestInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingDest, setIsLoadingDest] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [days, setDays] = useState('');
    const [budget, setBudget] = useState(null);
    const [companion, setCompanion] = useState(null);

    // Free OpenStreetMap Geocoding API with Debounce
    useEffect(() => {
        const fetchPlaces = async () => {
            if (destInput.length < 3) {
                setSuggestions([]);
                return;
            }
            setIsLoadingDest(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destInput)}&format=json&addressdetails=1&limit=5&featuretype=city`);
                const data = await res.json();
                setSuggestions(data.map(item => item.display_name));
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
        setDestInput(city);
        setSuggestions([]);
    };

    const budgets = [
        { id: 'cheap', emoji: '💵', title: 'Cheap', desc: 'Stay conscious of costs' },
        { id: 'moderate', emoji: '💰', title: 'Moderate', desc: 'Keep costs on the average' },
        { id: 'luxury', emoji: '💎', title: 'Luxury', desc: "Don't worry about cost" }
    ];

    const companions = [
        { id: 'solo', emoji: '🚶', title: 'Just Me', desc: 'A sole traveler in exploration' },
        { id: 'couple', emoji: '🥂', title: 'A Couple', desc: 'Two travelers in tandem' },
        { id: 'family', emoji: '🏡', title: 'Family', desc: 'A group of fun loving adventurers' },
        { id: 'friends', emoji: '🎉', title: 'Friends', desc: 'A bunch of thrill seekers' }
    ];

    const canGenerate = destInput && days && budget && companion;

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
            <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />
            <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '100px', paddingLeft: '20px', paddingRight: '20px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '40px' }}>Tell us your travel preferences 🏕️</h1>

                {/* Destination with API */}
                <div style={{ marginBottom: '30px', position: 'relative' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>What is destination of choice?</label>
                    <input
                        type="text"
                        value={destInput}
                        onChange={(e) => setDestInput(e.target.value)}
                        placeholder="Start typing a city (e.g., Tokyo, Paris)..."
                        style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box' }}
                    />
                    {isLoadingDest && <p style={{ position: 'absolute', right: '15px', top: '40px', color: '#64748b', fontSize: '12px' }}>Searching...</p>}

                    {suggestions.length > 0 && (
                        <ul className="custom-scrollbar" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', listStyle: 'none', padding: 0, margin: '4px 0 0 0', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxHeight: '200px', overflowY: 'auto' }}>
                            {suggestions.map((city, i) => (
                                <li key={i} onClick={() => selectCity(city)} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                                    📍 {city}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Days */}
                <div style={{ marginBottom: '40px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>How many days are you planning your trip?</label>
                    <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        placeholder="Ex. 3" min="1"
                        style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Budget */}
                <div style={{ marginBottom: '40px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '16px', fontSize: '20px' }}>What is Your Budget?</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {budgets.map(b => (
                            <SelectionCard key={b.id} {...b} isSelected={budget === b.id} onClick={() => setBudget(b.id)} />
                        ))}
                    </div>
                </div>

                {/* Companions */}
                <div style={{ marginBottom: '40px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '16px', fontSize: '20px' }}>Who do you plan on traveling with?</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        {companions.map(c => (
                            <SelectionCard key={c.id} {...c} isSelected={companion === c.id} onClick={() => setCompanion(c.id)} />
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <div style={{ textAlign: 'right' }}>
                    <button
                        disabled={!canGenerate || isGenerating}
                        onClick={async () => {
                            // 1. Force User to Log in first
                            if (!user) {
                                alert("Please Sign In first to generate a trip!");
                                onLogin();
                                return;
                            }

                            // 2. Call the AI
                            setIsGenerating(true);
                            try {
                                const aiItinerary = await generateRealItinerary(destInput, days, budget, companion);
                                window.scrollTo(0, 0);

                                // Pass form metadata + the AI generated itinerary
                                onGenerate({
                                    destination: destInput,
                                    days, budget, companion,
                                    itinerary: aiItinerary
                                });
                            } catch (error) {
                                alert("AI generation failed. Check console for details.");
                            } finally {
                                setIsGenerating(false);
                            }
                        }}
                        style={{
                            padding: '16px 40px',
                            backgroundColor: (!canGenerate || isGenerating) ? '#94a3b8' : '#0f172a',
                            color: '#fff', fontSize: '18px', fontWeight: '600', border: 'none', borderRadius: '8px',
                            cursor: (!canGenerate || isGenerating) ? 'not-allowed' : 'pointer'
                        }}>
                        {isGenerating ? 'AI is Planning... ⏳' : 'Generate Trip ✨'}
                    </button>
                </div>
            </div>
        </div>
    );
}
