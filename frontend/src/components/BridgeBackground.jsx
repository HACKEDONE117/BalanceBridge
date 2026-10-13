import React from 'react';

/**
 * High-Fidelity Architectural Cable Bridge Backdrop
 * Exact match to the perspective bridge structure visible behind the content cards in the reference image
 */
export default function BridgeBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0
    }}>
      {/* Ambient Radial Vignette Glows */}
      <div style={{
        position: 'absolute',
        top: '25%',
        right: '15%',
        width: '700px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(200, 155, 60, 0.07) 0%, rgba(13, 23, 40, 0) 70%)',
        filter: 'blur(70px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '20%',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, rgba(7, 13, 24, 0) 70%)',
        filter: 'blur(60px)'
      }} />

      {/* DETAILED SUSPENSION CABLE BRIDGE BLUEPRINT SVG */}
      <svg
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -46%)',
          width: '110vw',
          height: '110vh',
          minWidth: '1300px',
          opacity: 0.38,
          mixBlendMode: 'screen'
        }}
      >
        <defs>
          <linearGradient id="mainTowerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#64748b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="cableGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2b85a" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#e2b85a" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="deckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#c89b3c" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 1. MAIN CENTRAL BRIDGE TOWER (Twin Pylons) */}
        <g stroke="url(#mainTowerGrad)">
          {/* Left Pylon Leg */}
          <polygon points="560,140 575,140 600,660 570,660" strokeWidth="2" fill="rgba(200, 155, 60, 0.03)" />
          {/* Right Pylon Leg */}
          <polygon points="625,140 640,140 670,660 640,660" strokeWidth="2" fill="rgba(200, 155, 60, 0.03)" />
          
          {/* Pylon Portal Cross Beams */}
          <line x1="568" y1="210" x2="632" y2="210" strokeWidth="2" />
          <line x1="575" y1="310" x2="642" y2="310" strokeWidth="2.5" />
          <line x1="583" y1="430" x2="652" y2="430" strokeWidth="3" />
          <line x1="590" y1="560" x2="660" y2="560" strokeWidth="3" />
          
          {/* Cross Diagonal Bracing inside tower */}
          <line x1="568" y1="210" x2="642" y2="310" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="632" y1="210" x2="575" y2="310" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="575" y1="310" x2="652" y2="430" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="642" y1="310" x2="583" y2="430" strokeWidth="1" strokeDasharray="3 3" />

          {/* Tower Top Finial */}
          <polygon points="600,100 592,140 608,140" strokeWidth="1.5" />
        </g>

        {/* 2. SECONDARY RIGHT BRIDGE TOWER */}
        <g stroke="url(#mainTowerGrad)">
          {/* Left Pylon Leg */}
          <polygon points="1060,190 1072,190 1092,660 1068,660" strokeWidth="1.8" fill="rgba(200, 155, 60, 0.02)" />
          {/* Right Pylon Leg */}
          <polygon points="1112,190 1124,190 1148,660 1124,660" strokeWidth="1.8" fill="rgba(200, 155, 60, 0.02)" />
          
          {/* Cross Beams */}
          <line x1="1066" y1="250" x2="1118" y2="250" strokeWidth="1.8" />
          <line x1="1072" y1="340" x2="1126" y2="340" strokeWidth="2" />
          <line x1="1078" y1="440" x2="1134" y2="440" strokeWidth="2.5" />
          <line x1="1084" y1="550" x2="1140" y2="550" strokeWidth="2.5" />
          
          {/* Tower Top Finial */}
          <polygon points="1093,150 1087,190 1100,190" strokeWidth="1.2" />
        </g>

        {/* 3. CABLE-STAYED DIAGONAL RAYS (Fans radiating from towers like in reference) */}
        <g stroke="url(#cableGlowGrad)" strokeWidth="1.2">
          {/* Left Tower: Leftward fan cables */}
          <line x1="600" y1="160" x2="180" y2="620" />
          <line x1="600" y1="180" x2="250" y2="620" />
          <line x1="600" y1="205" x2="320" y2="620" />
          <line x1="600" y1="235" x2="390" y2="620" />
          <line x1="600" y1="270" x2="460" y2="620" />
          <line x1="600" y1="310" x2="520" y2="620" />

          {/* Left Tower: Central Span fan cables */}
          <line x1="600" y1="160" x2="840" y2="620" />
          <line x1="600" y1="180" x2="790" y2="620" />
          <line x1="600" y1="205" x2="740" y2="620" />
          <line x1="600" y1="235" x2="690" y2="620" />
          <line x1="600" y1="270" x2="650" y2="620" />

          {/* Right Tower: Central Span fan cables */}
          <line x1="1093" y1="210" x2="850" y2="620" />
          <line x1="1093" y1="230" x2="900" y2="620" />
          <line x1="1093" y1="255" x2="950" y2="620" />
          <line x1="1093" y1="285" x2="1000" y2="620" />
          <line x1="1093" y1="320" x2="1040" y2="620" />

          {/* Right Tower: Rightward fan cables */}
          <line x1="1093" y1="210" x2="1480" y2="620" />
          <line x1="1093" y1="230" x2="1410" y2="620" />
          <line x1="1093" y1="255" x2="1340" y2="620" />
          <line x1="1093" y1="285" x2="1270" y2="620" />
          <line x1="1093" y1="320" x2="1200" y2="620" />
          <line x1="1093" y1="360" x2="1150" y2="620" />
        </g>

        {/* 4. MAIN CATENARY SUSPENSION CABLES */}
        <path
          d="M 120 620 Q 360 380 600 150 Q 845 520 1093 200 Q 1320 400 1520 620"
          stroke="url(#cableGlowGrad)"
          strokeWidth="3.2"
          fill="none"
        />
        <path
          d="M 120 626 Q 360 388 600 158 Q 845 528 1093 208 Q 1320 408 1520 626"
          stroke="url(#cableGlowGrad)"
          strokeWidth="1.8"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* 5. BRIDGE ROADWAY DECK & TRUSS */}
        <g stroke="url(#deckGrad)">
          {/* Main Road Deck Bar */}
          <line x1="80" y1="620" x2="1550" y2="620" strokeWidth="4.5" />
          {/* Lower Truss Rail */}
          <line x1="80" y1="635" x2="1550" y2="635" strokeWidth="2.5" />
          {/* Pier Foundation Line */}
          <line x1="80" y1="655" x2="1550" y2="655" strokeWidth="1" strokeDasharray="12 8" />

          {/* Under-deck Truss Webbing (Zig-zag) */}
          {Array.from({ length: 48 }).map((_, i) => {
            const x = 100 + i * 30;
            return (
              <line
                key={i}
                x1={x}
                y1={i % 2 === 0 ? 620 : 635}
                x2={x + 30}
                y2={i % 2 === 0 ? 635 : 620}
                strokeWidth="1"
                opacity="0.6"
              />
            );
          })}
        </g>

        {/* 6. PERSPECTIVE WATER / ISOMETRIC CONTOUR RAYS (seen at bottom right in reference) */}
        <g stroke="rgba(56, 189, 248, 0.18)" strokeWidth="1">
          <path d="M 900 680 Q 1200 670 1580 720" fill="none" />
          <path d="M 850 710 Q 1200 690 1580 760" fill="none" />
          <path d="M 800 740 Q 1200 720 1580 810" fill="none" />
          <path d="M 750 780 Q 1200 750 1580 870" fill="none" />
        </g>
      </svg>
    </div>
  );
}
