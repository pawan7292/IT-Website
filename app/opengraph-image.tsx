import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Digital Marmat IT Services'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F1F3D 0%, #1B3A6B 50%, #1E73D8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 900, color: 'white', letterSpacing: '-2px' }}>
          <span style={{ color: '#1E73D8' }}>DIGITAL</span>
          <span style={{ color: 'white' }}> MARMAT</span>
        </div>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', marginTop: 12, letterSpacing: '6px', textTransform: 'uppercase' }}>
          IT Services
        </div>
        <div style={{
          marginTop: 40, fontSize: 20, color: 'rgba(255,255,255,0.8)',
          background: 'rgba(255,255,255,0.1)', padding: '12px 32px', borderRadius: 999,
        }}>
          Web Development · SEO · Digital Marketing · AI Automation
        </div>
        <div style={{ position: 'absolute', bottom: 32, fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>
          digitalmarmat.com · Kathmandu, Nepal
        </div>
      </div>
    ),
    { ...size }
  )
}
