import React, { useState, useEffect } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import AccountSettings from '../components/profile/AccountSettings';
import TripsGrid from '../components/profile/TripsGrid';
import FavoritesGrid from '../components/profile/FavoritesGrid';

export default function ProfilePage({ user, generatedTrips = [], favoriteDestinations = [], onNavigate }) {
    const [activeTab, setActiveTab] = useState('My Trips');

    // Local state for editing profile
    const [isEditingName, setIsEditingName] = useState(false);
    const [customName, setCustomName] = useState(!user?.isAnonymous ? user?.displayName : 'Guest User');
    const [customCover, setCustomCover] = useState('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80');
    const [customAvatar, setCustomAvatar] = useState(user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`);
    const [customLocation, setCustomLocation] = useState('Earth');

    // Update local state when user changes (e.g. after switching accounts)
    useEffect(() => {
        if (user) {
            setCustomName(!user.isAnonymous ? user.displayName : 'Guest User');
            setCustomAvatar(user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`);
            setCustomCover('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80');
        }
    }, [user]);

    const handleNameSave = () => {
        setIsEditingName(false);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', paddingTop: '72px', paddingBottom: '60px' }}>
            <ProfileHeader
                customCover={customCover} setCustomCover={setCustomCover}
                customAvatar={customAvatar} setCustomAvatar={setCustomAvatar}
                customName={customName} setCustomName={setCustomName}
                isEditingName={isEditingName} setIsEditingName={setIsEditingName}
                handleNameSave={handleNameSave} customLocation={customLocation}
                generatedTripsCount={generatedTrips.length} favoritesCount={favoriteDestinations.length}
            />

            {/* Main Content Area */}
            <div style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 24px' }}>

                {/* Tabs */}
                <div style={{ display: 'flex', backgroundColor: '#e5e7eb', borderRadius: '12px', padding: '8px', gap: '8px', overflowX: 'auto' }}>
                    {['My Trips', 'Favourite Destinations', 'Account Settings'].map((tab, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                minWidth: '150px',
                                cursor: 'pointer',
                                backgroundColor: activeTab === tab === true ? '#fff' : (activeTab === tab ? '#fff' : 'transparent'),
                                fontWeight: activeTab === tab ? '700' : '500',
                                boxShadow: activeTab === tab ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* Section Content */}
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '40px 0 24px', color: '#111827' }}>
                    {activeTab}
                </h2>

                {activeTab === 'My Trips' && <TripsGrid generatedTrips={generatedTrips} />}
                {activeTab === 'Favourite Destinations' && <FavoritesGrid favoriteDestinations={favoriteDestinations} />}
                {activeTab === 'Account Settings' && (
                    <AccountSettings
                        customName={customName} setCustomName={setCustomName}
                        customLocation={customLocation} setCustomLocation={setCustomLocation}
                        onNavigate={onNavigate}
                    />
                )}
            </div>
        </div>
    );
}
