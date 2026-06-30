import React, { useState, useEffect, useCallback } from 'react';

/* ─────────────────────────────────────────
   Destination data
   Images expected in /public folder:
     Backgrounds : kerala_bg.png · thailand_bg.png · indonesia_bg.png · bali_bg.png
     Card thumbs : kerala_card.png · thailand_card.png · indonesia_card.png · bali_card.png
───────────────────────────────────────── */
const DESTINATIONS = [
  {
    id: 0,
    name: 'KERALA',
    bg: '/kerala_bg.png',
    description:
      "Kerala sits along the Arabian Sea shoreline, flanked by backwaters and lush rolling tea plantations. The region's national parks like Eravikulam and Wayanad are home to elephants, rich spice gardens, and breathtaking misty mountain ranges.",
    cards: [
      { name: 'Thailand', img: '/thailand_card.png' },
      { name: 'Indonesia', img: '/indonesia_card.png' },
      { name: 'Bali', img: '/bali_card.png' },
    ],
  },
  {
    id: 1,
    name: 'THAILAND',
    bg: '/thailand_bg.png',
    description:
      'Thailand is a Southeast Asian country known for tropical beaches, opulent royal palaces, ancient ruins and ornate temples displaying figures of Buddha. Wat Arun, Wat Pho and the Emerald Buddha Temple are iconic Bangkok landmarks. Nearby beach resorts include bustling Pattaya and fashionable Hua Hin.',
    cards: [
      { name: 'Indonesia', img: '/indonesia_card.png' },
      { name: 'Bali', img: '/bali_card.png' },
      { name: 'Kerala', img: '/kerala_card.png' },
    ],
  },
  {
    id: 2,
    name: 'INDONESIA',
    bg: '/indonesia_bg.png',
    description:
      'As the largest archipelagic country in the world, Indonesia is blessed with so many different people, cultures, customs, traditions, artworks, food, animals, plants, landscapes, and everything that made it almost like 200 countries melted beautifully into one.',
    cards: [
      { name: 'Bali', img: '/bali_card.png' },
      { name: 'Kerala', img: '/kerala_card.png' },
      { name: 'Thailand', img: '/thailand_card.png' },
    ],
  },
  {
    id: 3,
    name: 'BALI',
    bg: '/bali_bg.png',
    description:
      'Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. Home to cliffside Uluwatu Temple, lively Kuta, serene Seminyak, and world-renowned yoga and meditation retreats.',
    cards: [
      { name: 'Kerala', img: '/kerala_card.png' },
      { name: 'Thailand', img: '/thailand_card.png' },
      { name: 'Indonesia', img: '/indonesia_card.png' },

    ],
  },
];

const NAV_LINKS = ['News', 'Destinations', 'Blog', 'Contact'];

/* ─── Rating dots ─── */
function RatingDots({ count = 5, filled = 4 }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: i < filled ? '#fff' : 'rgba(255,255,255,0.28)',
          }}
        />
      ))}
    </div>
  );
}

/* ─── triply bird logo ─── */
function triplyLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 22 C6 18 5 14 8 10 C11 6 15 5 18 7 C21 9 20 14 17 17 C14 20 10 21 8 22Z" fill="#f97316" />
      <path d="M18 7 C22 5 27 8 26 14 C25 18 21 21 17 20 C19 17 20 12 18 7Z" fill="#fb923c" />
      <path d="M13 14 L16 10 L19 14 L16 19Z" fill="#fef08a" />
      <circle cx="19" cy="9" r="1.5" fill="#fff" opacity="0.8" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   HERO COMPONENT
══════════════════════════════════════════ */
export default function Hero({ onStartPlan, user, onLogin, onLogout }) {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const total = DESTINATIONS.length;

  const goTo = useCallback((idx) => {
    setCurrent(idx);
    setAnimKey((k) => k + 1);
  }, []);

  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const dest = DESTINATIONS[current];
  const userName = user?.displayName?.split(' ')[0] || (user ? 'User' : 'Guest');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

        @keyframes heroTitleIn {
          from { opacity: 0; transform: translateX(-55px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes cardSlideIn {
          from { opacity: 0; transform: translateX(50px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }

        .triply-nav-link {
          color: rgba(255,255,255,0.78);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .triply-nav-link:hover { color: #fff; }

        .triply-search-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.1);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: all 0.2s ease;
        }
        .triply-search-btn:hover {
          background: rgba(255,255,255,0.22);
          border-color: #fff;
        }

        .triply-explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 14px 30px;
          background: #1e3a8a;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.4px;
          font-family: 'Inter', sans-serif;
          transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .triply-explore-btn:hover {
          background: #1d4ed8;
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(30, 58, 138, 0.55);
        }

        .triply-dest-card {
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 28px 65px rgba(0,0,0,0.48);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .triply-dest-card:hover {
          transform: translateY(-10px) !important;
          box-shadow: 0 38px 72px rgba(0,0,0,0.55);
        }

        .triply-dot {
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .triply-dot:hover { transform: scale(1.45); }

        .triply-arrow-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.13);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.25s ease;
        }
        .triply-arrow-btn:hover {
          background: rgba(255,255,255,0.26);
          border-color: #fff;
          transform: scale(1.1);
        }

        .triply-bookmark-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4;
          box-shadow: 0 3px 10px rgba(0,0,0,0.22);
          cursor: pointer;
          border: none;
          transition: transform 0.2s ease;
        }
        .triply-bookmark-btn:hover { transform: scale(1.12); }
      `}</style>

      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ── Background slides (crossfade) ── */}
        {DESTINATIONS.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${d.bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === current ? 1 : 0,
              transition: 'opacity 1.3s ease-in-out',
              zIndex: 0,
            }}
          />
        ))}

        {/* ── Gradient overlays ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, rgba(4,12,36,0.82) 0%, rgba(4,12,36,0.58) 40%, rgba(4,12,36,0.18) 68%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 55%)',
        }} />



        {/* ══════════════════════════════
            LEFT — Vertical slide dots
        ══════════════════════════════ */}
        <div style={{
          position: 'absolute',
          left: '26px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '42px',
          }}>
            {/* Connector line */}
            <div style={{
              position: 'absolute',
              top: 0, bottom: 0,
              left: '50%',
              width: '1px',
              background: 'rgba(255,255,255,0.22)',
              transform: 'translateX(-50%)',
            }} />

            {DESTINATIONS.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', zIndex: 1 }}
              >
                {/* Active number label */}
                {i === current && (
                  <span style={{
                    position: 'absolute',
                    right: '18px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    whiteSpace: 'nowrap',
                  }}>
                    {i + 1}
                  </span>
                )}
                <div
                  className="triply-dot"
                  style={{
                    width: i === current ? 10 : 6,
                    height: i === current ? 10 : 6,
                    background: i === current ? '#fff' : 'rgba(255,255,255,0.32)',
                    boxShadow: i === current ? '0 0 0 3px rgba(255,255,255,0.22)' : 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════
            MAIN CONTENT — left / bottom
        ══════════════════════════════ */}
        <div style={{
          position: 'absolute',
          left: '7%',
          bottom: '14%',
          zIndex: 10,
          maxWidth: '470px',
        }}>
          {/* Destination title */}
          <h1
            key={`title-${animKey}`}
            style={{
              fontSize: 'clamp(56px, 8vw, 108px)',
              fontWeight: '900',
              color: '#fff',
              margin: '0 0 16px 0',
              lineHeight: 0.92,
              letterSpacing: '-3px',
              textShadow: '0 6px 24px rgba(0,0,0,0.35)',
              animation: 'heroTitleIn 0.65s cubic-bezier(0.22,0.9,0.36,1) both',
            }}
          >
            {dest.name}
          </h1>

          {/* Description */}
          <p
            key={`desc-${animKey}`}
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '12.5px',
              lineHeight: '1.82',
              margin: '0 0 30px 0',
              maxWidth: '390px',
              animation: 'heroFadeUp 0.65s 0.2s cubic-bezier(0.22,0.9,0.36,1) both',
            }}
          >
            {dest.description}
          </p>

          {/* Explore button */}
          <button
            key={`btn-${animKey}`}
            onClick={onStartPlan}
            className="triply-explore-btn"
            style={{ animation: 'heroFadeUp 0.65s 0.35s cubic-bezier(0.22,0.9,0.36,1) both' }}
          >
            Explore
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ══════════════════════════════
            RIGHT — Destination cards
        ══════════════════════════════ */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '55%',
          transform: 'translateY(-47%)',
          zIndex: 10,
          display: 'flex',
          gap: '18px',
          alignItems: 'flex-start',
          pointerEvents: 'none',
        }}>
          {dest.cards.map((card, i) => (
            <div
              key={`card-${animKey}-${i}`}
              className="triply-dest-card"
              style={{
                position: 'relative',
                width: '278px',
                height: '360px',
                marginTop: i === 1 ? '-20px' : '0',
                animation: `cardSlideIn 0.6s ${i * 0.17}s cubic-bezier(0.22,0.9,0.36,1) both`,
                pointerEvents: 'all',
                flexShrink: 0,
              }}
            >
              {/* Top gradient for text legibility */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                padding: '14px 14px 28px',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, transparent 100%)',
                zIndex: 2,
              }}>
                <p style={{
                  color: '#fff',
                  margin: 0,
                  fontSize: '12px',
                  fontWeight: '600',
                  lineHeight: 1.3,
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}>
                  {card.name}
                </p>
                <RatingDots count={5} filled={4} />
              </div>

              {/* Bookmark */}
              <button className="triply-bookmark-btn" aria-label="Bookmark">
                <svg width="13" height="14" fill="#374151" viewBox="0 0 24 24">
                  <path d="M5 2h14a1 1 0 011 1v19l-8-4.5L4 22V3a1 1 0 011-1z" />
                </svg>
              </button>

              {/* Card image */}
              <img
                src={card.img}
                alt={card.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>

        {/* ══════════════════════════════
            BOTTOM — Controls
        ══════════════════════════════ */}

        {/* Rotated slide label — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: '58px',
          left: '-14px',
          transform: 'rotate(-90deg)',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '10.5px',
          letterSpacing: '3px',
          zIndex: 10,
          fontWeight: '500',
          userSelect: 'none',
        }}>
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>

        {/* Arrow buttons — bottom centre */}
        <div style={{
          position: 'absolute',
          bottom: '26px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 10,
        }}>
          <button className="triply-arrow-btn" onClick={prev} aria-label="Previous slide">
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="triply-arrow-btn" onClick={next} aria-label="Next slide">
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Slide counter — bottom right */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          right: '38px',
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
          zIndex: 10,
          userSelect: 'none',
        }}>
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>
            {String(current + 1).padStart(3, '0')}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '12px', margin: '0 1px' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            {String(total).padStart(2, '0')}
          </span>
        </div>
      </section>
    </>
  );
}
