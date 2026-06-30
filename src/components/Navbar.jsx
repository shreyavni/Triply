import React from 'react';

export default function Navbar({ user, onLogin, onLogout, onNavigate, currentPage }) {
    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '16px 40px', 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            color: 'black',
            backgroundColor: 'white',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            <div 
                onClick={() => onNavigate && onNavigate('landing')}
                style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                <img src="triply1_logo.png" alt="" style={{ width: '100px', height: '50px', transform: 'scale(1.8)', transformOrigin: 'left center',}} />
            </div>
            
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', color: 'black', fontWeight: '500', fontSize: '15px' }}>
                {[
                    { id: 'landing', label: 'Home' },
                    { id: 'setup', label: 'Destinations' },
                    { id: 'explore', label: 'Explore' }
                ].map(item => {
                    const isActive = currentPage === item.id;
                    return (
                        <div 
                            key={item.id}
                            onClick={() => onNavigate && onNavigate(item.id)}
                            style={{ 
                                position: 'relative', 
                                cursor: 'pointer',
                                padding: '4px 0',
                                color: isActive ? '#1e3a8a' : 'black',
                                fontWeight: isActive ? '700' : '500',
                                transition: 'color 0.2s ease'
                            }}
                        >
                            {item.label}
                            <div style={{
                                position: 'absolute',
                                bottom: '-4px',
                                left: 0,
                                width: '100%',
                                height: '2px',
                                backgroundColor: '#1e3a8a',
                                transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                                transformOrigin: 'center',
                                transition: 'transform 0.3s ease'
                            }} />
                        </div>
                    );
                })}
            </div>

            <div>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('profile')}>
                            <span style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                                {user.isAnonymous ? 'Guest User' : user.displayName || 'Logged In'}
                            </span>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                                <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid || 'guest'}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>
                        <button onClick={onLogout} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#ef4444', border: 'none', borderRadius: '25px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <button onClick={onLogin} style={{ padding: '10px 24px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: '600', cursor: 'pointer' }}>
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
}