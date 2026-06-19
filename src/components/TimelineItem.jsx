import React, { useEffect, useRef, useState } from 'react';

export default function TimelineItem({ item, index, theme, destination }) {
  const [isVisible, setVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const domRef = useRef();

  // Scroll Animation
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setVisible(true);
      });
    }, { threshold: 0.15 });

    if (domRef.current) observer.observe(domRef.current);
    return () => { if (domRef.current) observer.unobserve(domRef.current); };
  }, []);

  // THE FREE IMAGE TRICK (Wikipedia API + Unsplash Fallbacks)
  useEffect(() => {
    const fallbacks = {
      hotel: 'https://images.unsplash.com/photo-1542314831-c6a4d14d2301?auto=format&fit=crop&w=400&q=80',
      meal: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      activity: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80'
    };

    const fetchFreeImage = async () => {
      try {
        // Clean the title for a better Wiki search (e.g., "JK Temple" instead of "JK Temple Kanpur")
        const cleanTitle = item.title.split(',')[0].trim();

        // Ask Wikipedia for the main thumbnail of this place
        const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cleanTitle)}&prop=pageimages&format=json&pithumbsize=400&origin=*`);
        const wikiData = await wikiRes.json();
        const pages = wikiData.query.pages;
        const pageId = Object.keys(pages)[0];

        // If Wikipedia has a photo, use it! Otherwise, use the Unsplash fallback.
        if (pageId !== "-1" && pages[pageId].thumbnail) {
          setPhotoUrl(pages[pageId].thumbnail.source);
        } else {
          setPhotoUrl(fallbacks[item.type] || fallbacks.activity);
        }
      } catch (error) {
        // If anything fails, use the beautiful fallback image
        setPhotoUrl(fallbacks[item.type] || fallbacks.activity);
      }
    };

    fetchFreeImage();
  }, [item.title, item.type]);

  const isLeft = index % 2 === 0;

  // Google Maps Search URL (Clicking takes you straight to Maps!)
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' ' + destination)}`;

  return (
    <div
      ref={domRef}
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
      style={{
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        width: '100%',
        position: 'relative',
        marginBottom: '40px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(30px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        willChange: 'opacity, visibility'
      }}
    >
      {/* Timeline Dot */}
      <div style={{
        position: 'absolute', left: '50%', top: '20px', transform: 'translate(-50%, -50%)',
        width: '24px', height: '24px', borderRadius: '50%', backgroundColor: theme.main,
        border: '4px solid #fff', boxShadow: `0 0 10px ${theme.main}80`, zIndex: 5,
      }}></div>

      {/* Content Card */}
      <div style={{
        width: '45%', padding: '24px', backgroundColor: '#fff', borderRadius: '16px',
        borderTop: `6px solid ${theme.main}`, boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        position: 'relative', marginLeft: isLeft ? '0' : '5%', marginRight: isLeft ? '5%' : '0',
      }}>

        {/* CLICKABLE IMAGE: Opens Google Maps */}
        {photoUrl && (
          <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden' }}>
            <img
              src={photoUrl}
              alt={item.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.3s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </a>
        )}

        {/* Title and Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '28px', backgroundColor: theme.bg, padding: '12px', borderRadius: '12px' }}>
            {item.icon}
          </div>
          <div>
            <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a', cursor: 'pointer' }}>{item.title}</h4>
            </a>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.main }}>{item.time}</span>
          </div>
        </div>

        {/* Description */}
        <p style={{ margin: 0, color: '#475569', lineHeight: '1.5' }}>{item.desc}</p>
      </div>
    </div>
  );
}