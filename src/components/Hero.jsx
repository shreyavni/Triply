import React from 'react';

export default function Hero({ onStartPlan }) {
    const images = [
        { url: '[https://images.unsplash.com/photo-1539667547529-84c607280d20?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwcGxhY2VzJTIwaW4lMjB0aGUlMjB3b3JsZHxlbnwwfHwwfHx8MA%3D%3D?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80)', className: 'animate-float-1', top: '10%', left: '8%' },
        { url: '[https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80)', className: 'animate-float-2', top: '50%', left: '12%' },
        { url: '[https://unsplash.com/photos/brown-gondola-on-body-of-water-XG391m6rH_8?auto=format&fit=crop&w=400&q=80](https://unsplash.com/photos/brown-gondola-on-body-of-water-XG391m6rH_8?auto=format&fit=crop&w=400&q=80)', className: 'animate-float-3', top: '15%', right: '10%' },
        { url: '[https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80)', className: 'animate-float-1', top: '60%', right: '15%' },
    ];
    return (
        <section style={{ position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            {images.map((img, i) => (
                <div key={i} className={img.className} style={{ position: 'absolute', top: img.top, left: img.left, right: img.right, width: '180px', height: '250px', borderRadius: '16px', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', zIndex: 1 }}>
                    <img src={img.url} alt="Travel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            ))}
            <div style={{ textAlign: 'center', zIndex: 5, padding: '40px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
                <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 16px 0' }}>Your Next Adventure, <br /><span style={{ color: '#2563eb' }}>Engineered by AI</span></h1>
                <p style={{ color: '#475569', marginBottom: '32px', lineHeight: '1.6' }}>Discover tailored itineraries, hidden gems, and seamless routes custom-built for your travel style.</p>
                <button
                    onClick={onStartPlan}
                    style={{ padding: '16px 36px', backgroundColor: '#2563eb', color: '#fff', fontSize: '18px', fontWeight: '600', border: 'none', borderRadius: '30px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37,99,235,0.4)', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Let's create a trip plan
                </button>
            </div>
        </section>
    );
}
