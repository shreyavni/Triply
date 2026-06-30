import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function LoginPage({ onGoogleSignIn, onNavigate }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isSignUp, setIsSignUp] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                // Create account
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Update profile with name
                await updateProfile(userCredential.user, { displayName: name });
                onNavigate('setup');
            } else {
                // Login
                await signInWithEmailAndPassword(auth, email, password);
                onNavigate('setup');
            }
        } catch (err) {
            console.error("Auth error:", err);
            // Provide a user-friendly error message
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already in use. Try logging in.');
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Beautiful hot air balloon image from Unsplash
    const bgImage = "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2000&auto=format&fit=crop";

    return (
        <div style={{ 
            display: 'flex', 
            width: '100vw', 
            height: '100vh', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            fontFamily: "'Inter', sans-serif" ,
            overflow: "hidden"
        }}>
            {/* Blurred Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px)',
                transform: 'scale(1.1)', // Prevent blurred edges from showing white
                zIndex: -2
            }} />
            
            {/* Dark tint over blurred background */}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 30, 60, 0.3)', zIndex: -1 }} />

            {/* Back button (Floating outside) */}
            <button 
                onClick={() => onNavigate('landing')}
                style={{ position: 'absolute', top: '32px', right: '32px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '8px 16px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', zIndex: 10, transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
                <span>✕</span> Close
            </button>

            {/* Main Center Card */}
            <div style={{
                display: 'flex',
                width: '1000px',
                maxWidth: '95vw',
                height: '650px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                backgroundColor: '#0a4a7c'
            }}>
                
                {/* Left Side - Image */}
                <div style={{
                    flex: 1.1,
                    position: 'relative',
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '40px',
                    color: '#fff'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                    
                    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '20px' }}>
                        <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
                            ENJOY THE<br/>WORLD
                        </h1>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', margin: '0 0 32px 0', color: 'rgba(255,255,255,0.85)', maxWidth: '90%' }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <button style={{
                            padding: '12px 32px',
                            backgroundColor: '#fff',
                            color: '#0a4a7c',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div style={{
                    flex: 0.9,
                    backgroundColor: '#07487a',
                    padding: '40px 60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                }}>
                    {/* Top Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5l-8.2-1.8c-1.2-.3-2.4.3-2.8 1.5-.2.6-.1 1.2.2 1.6L8 15l-4 4-2.5-.5L1 20l4.5 2 2-2 4-4 4.2 4.3c.4.3 1 .4 1.6.2 1.2-.4 1.8-1.6 1.5-2.8z"/>
                        </svg>
                        <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px' }}>travel</span>
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '32px' }}>
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    {error && (
                        <div style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '4px', color: '#fca5a5', fontSize: '13px', marginBottom: '16px', boxSizing: 'border-box' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth} style={{ width: '100%' }}>
                        {isSignUp && (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Name*</label>
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Duxica Design"
                                    style={{ width: '100%', padding: '14px', borderRadius: '4px', border: 'none', backgroundColor: '#fdfdfd', color: '#1e293b', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Email Address*</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="design@duxica.com"
                                style={{ width: '100%', padding: '14px', borderRadius: '4px', border: 'none', backgroundColor: '#fdfdfd', color: '#1e293b', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Password*</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*****************"
                                style={{ width: '100%', padding: '14px', borderRadius: '4px', border: 'none', backgroundColor: '#fdfdfd', color: '#1e293b', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                            />
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '6px' }}>
                                Password must be at least 6 character.
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#fff', color: '#07487a', border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'wait' : 'pointer', transition: 'background 0.2s', opacity: loading ? 0.7 : 1 }} onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f1f5f9')} onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#fff')}>
                            {loading ? 'Processing...' : 'Continue'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <span 
                            onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
                            style={{ color: '#fff', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isSignUp ? "Log In" : "Sign Up"}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', width: '100%', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <span style={{ padding: '0 16px' }}>or</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    </div>

                    <button 
                        onClick={onGoogleSignIn}
                        style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign up with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
