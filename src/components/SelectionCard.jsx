import React from 'react';

export default function SelectionCard({ emoji, title, desc, iconBg, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '16px',
                border: isSelected ? '2px solid #111827' : '2px solid transparent',
                borderRadius: '16px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                boxShadow: isSelected ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '12px'
            }}
        >
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: iconBg || '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
            }}>
                {emoji}
            </div>
            <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#111827', fontWeight: '700' }}>{title}</h3>
                {desc && <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>{desc}</p>}
            </div>
        </div>
    );
}
