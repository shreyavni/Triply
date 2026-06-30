import React from 'react';
import Hero from '../components/Hero';

export default function LandingPage({ onStartPlan, user, onLogin, onLogout }) {
    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Hero
                onStartPlan={onStartPlan}
                user={user}
                onLogin={onLogin}
                onLogout={onLogout}
            />
        </div>
    );
}
