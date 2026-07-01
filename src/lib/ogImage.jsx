import { ImageResponse } from 'next/og'

import { siteName } from '@/lib/site'

// Shared configuration for the file-based `opengraph-image` / `twitter-image`
// conventions so both routes render an identical branded social card.
export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'
export const ogAlt = `${siteName} — Senior Software Engineer & Tech Lead`

export function createOgImage({
  title = siteName,
  subtitle = 'Senior Software Engineer & Tech Lead',
  eyebrow = 'mitrakos.com',
} = {}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#09090b',
          backgroundImage:
            'radial-gradient(1000px circle at 0% 0%, rgba(45,212,191,0.18), transparent 55%), radial-gradient(900px circle at 100% 100%, rgba(20,184,166,0.14), transparent 55%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '14px',
              height: '48px',
              borderRadius: '9999px',
              backgroundColor: '#2dd4bf',
            }}
          />
          <div
            style={{
              fontSize: '26px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#5eead4',
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '84px',
              fontWeight: 700,
              lineHeight: 1.05,
              color: '#fafafa',
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: '20px',
              fontSize: '38px',
              fontWeight: 500,
              color: '#a1a1aa',
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '26px', color: '#71717a' }}>
            Building high-quality web applications
          </div>
          <div style={{ fontSize: '26px', color: '#2dd4bf' }}>
            Web Design Awards · Winner
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  )
}
