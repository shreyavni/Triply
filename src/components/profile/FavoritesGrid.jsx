import React from 'react';

export default function FavoritesGrid({ favoriteDestinations }) {
    if (favoriteDestinations.length === 0) {
        return <p style={{ color: '#6b7280' }}>No favorites added yet. Explore and click the heart icon!</p>;
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {favoriteDestinations.map(place => (
                <div key={place.id} style={{ height: '300px', borderRadius: '16px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                    <img src={place.image} alt={place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px', color: 'white' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{place.title}</h3>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {place.tags.slice(0, 2).map(tag => (
                                <span key={tag} style={{ fontSize: '10px', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '10px' }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
