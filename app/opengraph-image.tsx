import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Vecindog — Buscá. Encontrá. Adoptá.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#F5EFE6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fondo coral suave en esquina */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: '#B85C4A',
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: '#B85C4A',
            opacity: 0.08,
          }}
        />

        {/* Ícono huella */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: '#B85C4A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            boxShadow: '0 12px 40px rgba(184,92,74,0.35)',
          }}
        >
          <svg
            viewBox="0 0 32 32"
            width="72"
            height="72"
            fill="white"
          >
            <ellipse cx="7"  cy="11" rx="3" ry="4" />
            <ellipse cx="14" cy="6"  rx="3" ry="4" />
            <ellipse cx="22" cy="6"  rx="3" ry="4" />
            <ellipse cx="29" cy="11" rx="3" ry="4" />
            <path d="M18 14c-6 0-10 5-10 9 0 4 4 6 10 6s10-2 10-6c0-4-9-9-10-9z" />
          </svg>
        </div>

        {/* Nombre */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#1A1A1A',
            letterSpacing: '-2px',
            lineHeight: 1,
          }}
        >
          Vecindog
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            fontWeight: 600,
            color: '#6B6258',
            letterSpacing: '0.5px',
          }}
        >
          Buscá · Encontrá · Adoptá
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: '2px solid rgba(184,92,74,0.2)',
            fontSize: 22,
            fontWeight: 700,
            color: '#B85C4A',
            letterSpacing: '0.5px',
          }}
        >
          mivecindog.com.ar
        </div>
      </div>
    ),
    { ...size },
  );
}
