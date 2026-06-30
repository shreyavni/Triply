import React, { useEffect, useRef, useState } from 'react';

// ─── Destination-aware curated fallback images (direct Unsplash photo IDs) ──
// Direct permanent CDN URLs — no API key, no redirect, always work.
const DEST_FALLBACKS = {
  kerala: {
    hotel:    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    meal:     'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=80',
    activity: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=600&q=80',
  },
  thailand: {
    hotel:    'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&q=80',
    meal:     'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80',
    activity: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80',
  },
  bali: {
    hotel:    'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80',
    meal:     'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    activity: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  indonesia: {
    hotel:    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    meal:     'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
    activity: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',
  },
};

// Generic type fallbacks (used when destination isn't in the map above)
const TYPE_FALLBACKS = {
  hotel:    'https://images.unsplash.com/photo-1542314831-c6a4d14d2301?w=600&q=80',
  meal:     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  activity: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
  beach:    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  museum:   'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80',
  temple:   'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80',
};

function getStaticFallback(destination, type) {
  const destKey = (destination || '').toLowerCase().split(/[\s,]+/)[0];
  return (
    DEST_FALLBACKS[destKey]?.[type] ||
    TYPE_FALLBACKS[type] ||
    TYPE_FALLBACKS.activity
  );
}

// ─── Free image fetcher — 3 sources, no billing/API key needed ───────────────
async function fetchPlaceImage(placeName, destination, type) {
  // ── Source 1: Wikipedia — try place name alone, then with destination ────
  const queries = [`${placeName} ${destination}`];
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query` +
        `&generator=search&gsrsearch=${encodeURIComponent(q)}` +
        `&gsrlimit=5&prop=pageimages&pithumbsize=600&format=json&origin=*`
      );
      const data = await res.json();
      if (data.query?.pages) {
        const pages = Object.values(data.query.pages);
        const hit = pages.find(p => p.thumbnail?.source);
        if (hit) return hit.thumbnail.source;
      }
    } catch (_) { /* continue to next source */ }
  }

  // ── Source 2: Wikidata SPARQL — find entity image (P18) by exact label ──
  try {
    const sparql = `SELECT ?image WHERE {
      ?item rdfs:label "${placeName}"@en .
      ?item wdt:P18 ?image .
    } LIMIT 1`;
    const res = await fetch(
      `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`,
      { headers: { Accept: 'application/sparql-results+json' } }
    );
    const data = await res.json();
    const binding = data.results?.bindings?.[0];
    if (binding?.image?.value) {
      const rawUrl = binding.image.value;
      // Convert Wikidata FilePath URL to Wikimedia thumb
      const filePart = rawUrl.split('/Special:FilePath/')[1];
      if (filePart) {
        return `https://commons.wikimedia.org/wiki/Special:FilePath/${filePart}?width=600`;
      }
    }
  } catch (_) { /* continue to next source */ }

  // ── Source 3: Wikimedia Commons file search ──────────────────────────────
  try {
    const res = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query` +
      `&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(placeName)}` +
      `&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json&origin=*`
    );
    const data = await res.json();
    if (data.query?.pages) {
      const pages = Object.values(data.query.pages);
      // Skip SVGs, logos, and icon-sized files
      const photo = pages.find(p => {
        const url = p.imageinfo?.[0]?.thumburl || '';
        return url && !url.endsWith('.svg') && !url.includes('Commons-logo');
      });
      if (photo) return photo.imageinfo[0].thumburl;
    }
  } catch (_) { /* all sources failed */ }

  return null; // caller uses static fallback
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function TimelineItem({ item, index, theme, destination }) {
  const [isVisible, setVisible]   = useState(false);
  const staticFallback            = getStaticFallback(destination, item.type);
  const [photoUrl, setPhotoUrl]   = useState(staticFallback);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false); // prevents onError loop
  const domRef = useRef(null);

  // ── Scroll-in animation ───────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setVisible(true); }),
      { threshold: 0.15 }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => { if (domRef.current) observer.unobserve(domRef.current); };
  }, []);

  // ── Fetch best available free image ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    // Immediately show the reliable static fallback
    setImgLoaded(false);
    setImgError(false);
    setPhotoUrl(staticFallback);
    // Then try to upgrade to a real place photo
    fetchPlaceImage(item.title, destination, item.type).then(url => {
      if (!cancelled && url) {
        setImgLoaded(false); // trigger shimmer while new URL loads
        setPhotoUrl(url);
      }
    });
    return () => { cancelled = true; };
  }, [item.title, destination, item.type]);

  const isLeft = index % 2 === 0;
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
        willChange: 'opacity, visibility',
      }}
    >
      {/* Timeline Dot */}
      <div style={{
        position: 'absolute', left: '50%', top: '20px',
        transform: 'translate(-50%, -50%)',
        width: '24px', height: '24px', borderRadius: '50%',
        backgroundColor: theme.main,
        border: '4px solid #fff', boxShadow: `0 0 10px ${theme.main}80`, zIndex: 5,
      }} />

      {/* Content Card */}
      <div style={{
        width: '45%', padding: '24px', backgroundColor: '#fff', borderRadius: '16px',
        borderTop: `6px solid ${theme.main}`, boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        position: 'relative',
        marginLeft: isLeft ? '0' : '5%',
        marginRight: isLeft ? '5%' : '0',
      }}>

        {/* ── Place Image ── */}
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', marginBottom: '16px', borderRadius: '12px',
            overflow: 'hidden', height: '200px',
            backgroundColor: '#e2e8f0', position: 'relative',
          }}
        >
          {/* Skeleton shimmer shown while image is loading */}
          {!imgLoaded && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite',
            }} />
          )}

          <img
            src={photoUrl}
            alt={item.title}
            onLoad={() => { setImgLoaded(true); setImgError(false); }}
            onError={() => {
              if (!imgError) {           // fire only once — prevents infinite loop
                setImgError(true);
                setImgLoaded(true);      // stop shimmer
                setPhotoUrl(staticFallback);
              }
            }}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'opacity 0.4s ease, transform 0.3s',
              opacity: imgLoaded ? 1 : 0,
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e  => e.currentTarget.style.transform = 'scale(1)'}
          />

          {/* Maps badge */}
          <span style={{
            position: 'absolute', bottom: '8px', right: '8px',
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            fontSize: '11px', padding: '3px 8px', borderRadius: '20px',
            backdropFilter: 'blur(4px)', pointerEvents: 'none',
          }}>
            📍 View on Maps
          </span>
        </a>

        {/* ── Title & Time ── */}
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

        <p style={{ margin: 0, color: '#475569', lineHeight: '1.5' }}>{item.desc}</p>
      </div>
    </div>
  );
}