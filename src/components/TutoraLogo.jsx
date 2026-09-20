import React from 'react';

export default function TutoraLogo({ 
  size = 'md', 
  light = false, 
  showSubtitle = true,
  subtitleText = 'Nền tảng Gia sư & AI'
}) {
  const sizeMap = {
    sm: { iconSize: 28, fontSize: '1.15rem', subSize: '0.65rem', gap: '8px' },
    md: { iconSize: 36, fontSize: '1.45rem', subSize: '0.72rem', gap: '10px' },
    lg: { iconSize: 46, fontSize: '1.85rem', subSize: '0.82rem', gap: '12px' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const textColor = light ? '#ffffff' : '#0f172a';
  const subtitleColor = light ? '#94a3b8' : '#64748b';

  return (
    <div 
      className="tutora-logo-container"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        userSelect: 'none',
        cursor: 'pointer'
      }}
    >
      {/* Modern Gradient Icon: Cap + Knowledge Book + Sparkle */}
      <div 
        style={{
          width: currentSize.iconSize,
          height: currentSize.iconSize,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
          flexShrink: 0
        }}
      >
        <svg 
          width={currentSize.iconSize * 0.62} 
          height={currentSize.iconSize * 0.62} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Graduation Cap */}
          <path 
            d="M12 3L2 8.5L12 14L22 8.5L12 3Z" 
            fill="#ffffff" 
            opacity="0.95"
          />
          {/* Bottom Cap Body */}
          <path 
            d="M6.5 11V16.2C6.5 18.5 8.9 20.5 12 20.5C15.1 20.5 17.5 18.5 17.5 16.2V11L12 14L6.5 11Z" 
            fill="#ffffff" 
            opacity="0.85"
          />
          {/* Tassel */}
          <path 
            d="M21 9V15M21 15C20.4 15 20 15.4 20 16C20 16.6 20.4 17 21 17C21.6 17 22 16.6 22 16C22 15.4 21.6 15 21 15Z" 
            stroke="#ffffff" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <div 
          style={{
            fontFamily: "var(--font-main, 'Plus Jakarta Sans', sans-serif)",
            fontSize: currentSize.fontSize,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: textColor,
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <span>Tutor</span>
          <span style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900
          }}>a</span>
          <span style={{ 
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            marginLeft: '2px',
            marginBottom: '8px'
          }} />
        </div>

        {showSubtitle && (
          <span 
            style={{
              fontFamily: "var(--font-main, 'Nunito', sans-serif)",
              fontSize: currentSize.subSize,
              fontWeight: 600,
              color: subtitleColor,
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
}
