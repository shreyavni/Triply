import React, { useRef } from 'react';

export default function ProfileHeader({
    customCover, setCustomCover,
    customAvatar, setCustomAvatar,
    customName, setCustomName,
    isEditingName, setIsEditingName,
    handleNameSave, customLocation,
    generatedTripsCount, favoritesCount
}) {
    const coverInputRef = useRef(null);
    const avatarInputRef = useRef(null);

    const handleImageUpload = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            {/* Hidden File Inputs */}
            <input type="file" accept="image/*" ref={coverInputRef} style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, setCustomCover)} />
            <input type="file" accept="image/*" ref={avatarInputRef} style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, setCustomAvatar)} />

            {/* Cover Photo */}
            <div style={{ height: '320px', width: '100%', position: 'relative' }}>
                <img
                    src={customCover}
                    alt="Cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                    onClick={() => coverInputRef.current.click()}
                    style={{ position: 'absolute', bottom: '24px', right: '24px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    📷 Upload Cover Photo
                </button>
            </div>

            {/* Profile Info Area */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'flex-end', marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                {/* Avatar */}
                <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', border: '6px solid #f3f4f6', backgroundColor: '#fff', flexShrink: 0 }}>
                    <img src={customAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div
                        onClick={() => avatarInputRef.current.click()}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white', fontSize: '12px', fontWeight: '600' }}
                    >
                        Edit
                    </div>
                </div>

                {/* Info */}
                <div style={{ marginLeft: '24px', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isEditingName ? (
                            <input
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                onBlur={handleNameSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                autoFocus
                                style={{ fontSize: '24px', fontWeight: '700', color: '#111827', border: '1px solid #d1d5db', borderRadius: '4px', padding: '2px 8px' }}
                            />
                        ) : (
                            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>{customName}</h1>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', color: '#4b5563', fontSize: '15px' }}>
                        <span>Location: {customLocation}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontWeight: '700', color: '#111827' }}>
                        <span>Trips Generated: <span style={{ color: '#f59e0b' }}>{generatedTripsCount}</span></span>
                        <span>Favorites: <span style={{ color: '#ef4444' }}>{favoritesCount}</span></span>
                    </div>
                </div>
            </div>
        </>
    );
}
