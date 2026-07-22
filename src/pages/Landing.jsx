import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Landing() {
  const navigate = useNavigate()
  const auth = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EC', padding: '48px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
          <div>
            <div style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: 700, color: '#3D3D3D' }}>
              done<span style={{ color: '#C4908A' }}>.</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '18px' }}>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#5E5E5E',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              style={{
                borderRadius: '999px',
                border: '1px solid #C4908A',
                background: '#EBCFB9',
                color: '#7D5632',
                fontWeight: 700,
                padding: '12px 22px',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Sign up
            </button>
          </div>
        </header>

        <main style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px', alignItems: 'center' }}>
          <section>
            <div style={{ marginBottom: '24px', color: '#C4908A', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '13px', fontWeight: 700 }}>
              Calm completion, daily.
            </div>
            <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '56px', lineHeight: 1.03, color: '#3D3D3D', margin: '0 0 24px' }}>
              Track small wins and grow a daily habit with a softer calendar rhythm.
            </h1>
            <p style={{ maxWidth: '560px', fontSize: '17px', lineHeight: 1.75, color: '#5E5E5E', marginBottom: '36px' }}>
              done helps you capture simple completion notes, reflect on progress, and return to calm planning tomorrow — all in a warm, distraction-free experience.
            </p>

            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate(auth.isAuthenticated ? '/calendar' : '/signup')}
                style={{
                  borderRadius: '999px',
                  border: 'none',
                  background: '#C4908A',
                  color: '#fff',
                  padding: '16px 30px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {auth.isAuthenticated ? 'Go to calendar' : 'Get started'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  borderRadius: '999px',
                  border: '1px solid #D8C1B5',
                  background: 'rgba(255,255,255,0.92)',
                  color: '#5E5E5E',
                  padding: '16px 30px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Log in
              </button>
            </div>
          </section>

          <section style={{ display: 'grid', gap: '22px' }}>
            <div style={{ background: '#EED7C6', borderRadius: '36px', padding: '32px', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: '40px', fontWeight: 700, color: '#3D3D3D', marginBottom: '18px' }}>
                  done.
                </div>
                <p style={{ color: '#5E5E5E', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
                  A soft home for your daily reflection, where progress is gentle and every note feels meaningful.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#fff', borderRadius: '999px', padding: '10px 16px', fontSize: '13px', color: '#7D5632', fontWeight: 700 }}>
                  • Daily entry
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#fff', borderRadius: '999px', padding: '10px 16px', fontSize: '13px', color: '#7D5632', fontWeight: 700 }}>
                  • Calendar view
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '18px' }}>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#C4908A', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  What you can do
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ padding: '18px 20px', borderRadius: '24px', background: '#fff', boxShadow: '0 18px 45px rgba(189,182,176,0.14)' }}>
                    <div style={{ fontWeight: 700, color: '#3D3D3D', marginBottom: '4px' }}>Capture calm completion</div>
                    <div style={{ fontSize: '14px', color: '#6A554D' }}>Write one simple note for each day and keep the habit moving forward.</div>
                  </div>
                  <div style={{ padding: '18px 20px', borderRadius: '24px', background: 'rgba(255,255,255,0.72)', border: '1px solid #E5D7CE' }}>
                    <div style={{ fontWeight: 700, color: '#3D3D3D', marginBottom: '4px' }}>Find rhythm in your weeks</div>
                    <div style={{ fontSize: '14px', color: '#6A554D' }}>A gentle calendar helps you see streaks without pressure.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <section style={{ marginTop: '30px' }}>
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <div style={{ background: '#fff', borderRadius: '28px', padding: '28px', boxShadow: '0 16px 40px rgba(189,182,176,0.12)' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#3D3D3D', marginBottom: '10px' }}>Soft start</div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#6A554D', margin: 0 }}>No busy dashboard — just one page for your note and a calm daily reflection.</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '28px', padding: '28px', boxShadow: '0 16px 40px rgba(189,182,176,0.12)' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#3D3D3D', marginBottom: '10px' }}>Private auth</div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#6A554D', margin: 0 }}>Local account support plus Google sign-in makes it easy to get started.</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '28px', padding: '28px', boxShadow: '0 16px 40px rgba(189,182,176,0.12)' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#3D3D3D', marginBottom: '10px' }}>Daily momentum</div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#6A554D', margin: 0 }}>Celebrate progress by reviewing notes and keeping the habit soft and sustainable.</p>
            </div>
          </div>
        </section>

        <footer style={{ marginTop: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', color: '#8D8D8D', fontSize: '14px' }}>
          <div>done. — built for calm productivity</div>
          <div style={{ display: 'flex', gap: '18px' }}>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              style={{ border: 'none', background: 'transparent', color: '#5E5E5E', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
            >
              Get started
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{ border: 'none', background: 'transparent', color: '#5E5E5E', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
            >
              Login
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Landing
