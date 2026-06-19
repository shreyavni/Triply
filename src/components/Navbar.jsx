import React from 'react';

export default function Navbar({ user, onLogin, onLogout }) {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', cursor: 'pointer' }}>
                ✈️ AI TripPlanner
            </div>
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
}