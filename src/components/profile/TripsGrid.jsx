import React from 'react';

export default function TripsGrid({ generatedTrips }) {
    if (generatedTrips.length === 0) {
        return <p style={{ color: '#6b7280' }}>You haven't generated any trips yet.</p>;
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {generatedTrips.map((trip, i) => (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{trip.destination}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                        {trip.days} Days • Budget: {trip.budget} • With: {trip.companion}
                    </p>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '4px 12px', backgroundColor: '#f3f4f6', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                            {trip.itinerary?.length || 0} Days Planned
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
