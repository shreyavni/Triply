import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

export default function LandingPage({ onStartPlan, user, onLogin, onLogout }) {
    return (
        <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)', minHeight: '100vh' }}>
            <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />
            <Hero onStartPlan={onStartPlan} />
        </div>
    );
}
