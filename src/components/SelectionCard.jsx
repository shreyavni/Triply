import React from 'react';

export default function SelectionCard({ emoji, title, desc, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '20px',
                border: isSelected ? '2px solid #2563eb' : '2px solid #e2e8f0',
                borderRadius: '16px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                transition: 'all 0.2s',
                textAlign: 'center',
                boxShadow: isSelected ? '0 4px 6px -1px rgba(37, 99, 235, 0.1)' : 'none'
            }}
        >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{emoji}</div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a' }}>{title}</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{desc}</p>
        </div>
    );
}
