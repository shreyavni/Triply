import React, { useState } from 'react';
import './ExplorePage.css';

const topPicks = [
  { id: 'tp1', title: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e9076113b51?auto=format&fit=crop&w=1200&q=80', tags: ['4 DAYS', '$1,200', 'COUPLES', 'CITY', 'FLIGHTS'] },
  { id: 'tp2', title: 'Kyoto', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', tags: ['7 DAYS', '$2,100', 'CULTURE', 'HOTEL INC', 'FOOD'] },
  { id: 'tp3', title: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1531366936337-7759a117565c?auto=format&fit=crop&w=1200&q=80', tags: ['5 DAYS', '$3,500', 'ADVENTURE', 'SKI', 'RESORT'] },
  { id: 'tp4', title: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', tags: ['10 DAYS', '$1,800', 'RELAX', 'BEACH', 'VILLA'] },
  { id: 'tp5', title: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', tags: ['3 DAYS', '$900', 'URBAN', 'SHOPPING', 'HOTEL'] },
  { id: 'tp6', title: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', tags: ['5 DAYS', '$1,400', 'HISTORY', 'FOOD', 'GUIDE'] },
  { id: 'tp7', title: 'Machu Picchu', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80', tags: ['6 DAYS', '$2,300', 'HIKING', 'NATURE', 'TOURS'] },
  { id: 'tp8', title: 'Santorini', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1200&q=80', tags: ['7 DAYS', '$2,800', 'ROMANCE', 'OCEAN', 'RESORT'] },
  { id: 'tp9', title: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', tags: ['4 DAYS', '$2,500', 'LUXURY', 'DESERT', 'SHOPPING'] },
  { id: 'tp10', title: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80', tags: ['8 DAYS', '$3,100', 'CITY', 'FOOD', 'TECH'] }
];

const favorites = [
  { id: 'fav1', title: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80', tags: ['7 DAYS', '$4,500', 'LUXURY', 'COUPLES', 'VILLA'] },
  { id: 'fav2', title: 'Venice', image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80', tags: ['3 DAYS', '$1,300', 'ROMANCE', 'CANAL', 'HOTEL'] },
  { id: 'fav3', title: 'Bora Bora', image: 'https://images.unsplash.com/photo-1589394815804-964ce0ff9657?auto=format&fit=crop&w=1200&q=80', tags: ['10 DAYS', '$6,000', 'HONEYMOON', 'RESORT', 'OCEAN'] },
  { id: 'fav4', title: 'Maui', image: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=1200&q=80', tags: ['6 DAYS', '$2,200', 'FAMILY', 'NATURE', 'BEACH'] },
  { id: 'fav5', title: 'Amalfi Coast', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=80', tags: ['5 DAYS', '$2,800', 'SCENIC', 'FOOD', 'ROAD TRIP'] }
];

const season = [
  { id: 'sea1', title: 'Ibiza', image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=1200&q=80', tags: ['SUMMER', '5 DAYS', '$1,800', 'PARTY', 'BEACH'] },
  { id: 'sea2', title: 'Mykonos', image: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1200&q=80', tags: ['SUMMER', '7 DAYS', '$2,400', 'ISLAND', 'VIBES'] },
  { id: 'sea3', title: 'Riviera', image: 'https://images.unsplash.com/photo-1533419992642-f046187db8c0?auto=format&fit=crop&w=1200&q=80', tags: ['SUMMER', '6 DAYS', '$3,500', 'LUXURY', 'YACHT'] },
  { id: 'sea4', title: 'Mallorca', image: 'https://images.unsplash.com/photo-1586053226626-edd7067d26bb?auto=format&fit=crop&w=1200&q=80', tags: ['SUMMER', '5 DAYS', '$1,600', 'FAMILY', 'RESORT'] },
  { id: 'sea5', title: 'Algarve', image: 'https://images.unsplash.com/photo-1549487537-b3c37afc696e?auto=format&fit=crop&w=1200&q=80', tags: ['SUMMER', '8 DAYS', '$1,400', 'CLIFFS', 'SURF'] }
];

export default function ExplorePage({ onNavigate, favoriteDestinations, onToggleFavorite }) {
    const [activeTab, setActiveTab] = useState('TOP PICKS');
    const [activeIndex, setActiveIndex] = useState(4); // Start middle of Top Picks

    const placesMap = {
        'TOP PICKS': topPicks,
        'FAVORITES': favorites,
        'SEASON': season
    };

    const currentPlaces = placesMap[activeTab];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setActiveIndex(Math.floor(placesMap[tab].length / 2));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev < currentPlaces.length - 1 ? prev + 1 : prev));
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleCardClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <div className="explore-container">
            {/* The main navbar is handled in App.jsx. This is the local tabs for the explore section */}
            <div className="explore-local-navbar">
                <span 
                    className={activeTab === 'TOP PICKS' ? 'active' : ''} 
                    onClick={() => handleTabChange('TOP PICKS')}
                >TOP PICKS</span>
                <span 
                    className={activeTab === 'FAVORITES' ? 'active' : ''} 
                    onClick={() => handleTabChange('FAVORITES')}
                >FAVORITES</span>
                <span 
                    className={activeTab === 'SEASON' ? 'active' : ''} 
                    onClick={() => handleTabChange('SEASON')}
                >SEASON</span>
            </div>

            <div className="carousel-wrapper">
                <button className="nav-arrow left" onClick={handlePrev} disabled={activeIndex === 0}>
                   &#10094;
                </button>

                <div className="carousel">
                    {currentPlaces.map((place, index) => {
                        let offset = index - activeIndex;
                        let direction = Math.sign(offset);
                        let absOffset = Math.abs(offset);
                        
                        let className = 'card';
                        if (offset === 0) className += ' active';
                        else if (absOffset === 1) className += direction > 0 ? ' right-1' : ' left-1';
                        else if (absOffset === 2) className += direction > 0 ? ' right-2' : ' left-2';
                        else className += ' hidden';

                        return (
                            <div 
                                key={place.id} 
                                className={className} 
                                style={{backgroundImage: `url(${place.image})`}}
                                onClick={() => offset !== 0 && handleCardClick(index)}
                            >
                                <div className="card-top-bar">
                                    <div className="menu-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="3" y1="12" x2="21" y2="12"></line>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <line x1="3" y1="18" x2="21" y2="18"></line>
                                        </svg>
                                    </div>
                                    <div className="right-icons">
                                        <span className="share-icon" onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(window.location.href + '?place=' + place.title);
                                            alert(`Copied link for ${place.title} to clipboard!`);
                                        }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="18" cy="5" r="3"></circle>
                                                <circle cx="6" cy="12" r="3"></circle>
                                                <circle cx="18" cy="19" r="3"></circle>
                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                            </svg>
                                        </span>
                                        <span className="heart-icon" onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleFavorite && onToggleFavorite(place);
                                        }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill={favoriteDestinations?.find(p => p.id === place.id) ? '#ef4444' : 'none'} stroke={favoriteDestinations?.find(p => p.id === place.id) ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <h1 className="card-title">{place.title}</h1>
                                    <div className="tags-section">
                                        <div className="tags-label">DETAILS <span className="image-count">{(index+1) * 23 + 87} REVIEWS</span></div>
                                        <div className="tags-container">
                                            {place.tags.map(tag => (
                                                <span key={tag} className="tag-pill">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="nav-arrow right" onClick={handleNext} disabled={activeIndex === currentPlaces.length - 1}>
                    &#10095;
                </button>
            </div>

            <div className="carousel-dots">
                {currentPlaces.map((_, index) => (
                    <span 
                        key={index} 
                        className={`dot ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}
