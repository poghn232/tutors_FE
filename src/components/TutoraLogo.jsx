import React from 'react';

export default function TutoraLogo({ 
  size = 'md', 
  light = false,
  showSubtitle = false,
  subtitleText = 'Gia sư & Học tập'
}) {
  const sizeMap = {
    sm: { height: 26, fontSize: '1.25rem' },
    md: { height: 34, fontSize: '1.65rem' },
    lg: { height: 44, fontSize: '2.1rem' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      className="totora-brand-logo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        userSelect: 'none',
        cursor: 'pointer',
        fontFamily: "'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif"
      }}
    >
      {/* Figma standard Totora Wordmark with bubbly colorful letters */}
      <svg 
        height={currentSize.height} 
        viewBox="0 0 165 42" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* t with cute orange cap/accent */}
        <g>
          <path 
            d="M8 8L16 4L13 14H6L8 8Z" 
            fill="#f97316" 
          />
          <path 
            d="M9 13H18V18H14V28C14 30.5 15.5 31.5 17.5 31.5C18.5 31.5 19.5 31.2 20 30.8V35.5C19 36 17.5 36.5 15.5 36.5C10.5 36.5 8 33.5 8 28V18H4V13H8V8L14 5V13H9Z" 
            fill="#2563eb" 
          />
        </g>
        {/* o (cyan) */}
        <path 
          d="M36 13C43 13 48 18 48 25C48 32 43 37 36 37C29 37 24 32 24 25C24 18 29 13 36 13ZM36 19C32.5 19 30 21.5 30 25C30 28.5 32.5 31 36 31C39.5 31 42 28.5 42 25C42 21.5 39.5 19 36 19Z" 
          fill="#06b6d4" 
        />
        {/* t (blue) */}
        <path 
          d="M57 13H64V18H61V28C61 30.5 62.5 31.5 64.5 31.5C65.5 31.5 66.5 31.2 67 30.8V35.5C66 36 64.5 36.5 62.5 36.5C57.5 36.5 55 33.5 55 28V18H51V13H55V8L61 5V13H57Z" 
          fill="#2563eb" 
        />
        {/* o (orange) */}
        <path 
          d="M81 13C88 13 93 18 93 25C93 32 88 37 81 37C74 37 69 32 69 25C69 18 74 13 81 13ZM81 19C77.5 19 75 21.5 75 25C75 28.5 77.5 31 81 31C84.5 31 87 28.5 87 25C87 21.5 84.5 19 81 19Z" 
          fill="#f59e0b" 
        />
        {/* r (blue) */}
        <path 
          d="M100 14H106V17.5C108 14.5 111.5 13.5 115 13.8V19.8C111.5 19.5 106 20.8 106 25.5V36H100V14Z" 
          fill="#2563eb" 
        />
        {/* a (cyan) */}
        <path 
          d="M131 13.5V17C128.5 14 124 13 120 13C113 13 108.5 17.5 108.5 23C108.5 28.5 113.5 32.5 120.5 32.5C124.5 32.5 128.5 31 131 28.5V36H137V13.5H131ZM122.5 27.5C118 27.5 115 25.5 115 22.5C115 19.5 118 18 122.5 18C126.5 18 130 20 131 22.5C131 25.5 127 27.5 122.5 27.5Z" 
          fill="#06b6d4" 
        />
        {/* Playful yellow dot at end */}
        <circle cx="145" cy="32" r="3.5" fill="#facc15" stroke="#2563eb" strokeWidth="1" />
      </svg>

      {showSubtitle && (
        <span style={{
          fontSize: '0.72rem',
          color: light ? '#94a3b8' : '#64748b',
          fontWeight: 700,
          letterSpacing: '0.04em',
          marginLeft: '4px'
        }}>
          {subtitleText}
        </span>
      )}
    </div>
  );
}
