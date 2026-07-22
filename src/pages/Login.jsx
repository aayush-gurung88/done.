import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import undrawDone from '../assets/undraw_done.svg'

function Login() {
  const { signIn, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/calendar" replace />
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0EC' }}>
      <div style={{ display: 'flex', flexDirection: 'row', width: '85%', maxWidth: '960px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '45%', paddingRight: '48px' }}>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '48px', fontWeight: 800, color: '#3D3D3D', marginBottom: '40px' }}>
            Welcome Back!!
          </h1>

          <div style={{ position: 'relative', marginBottom: '26px' }}>
            <span style={{ position: 'absolute', top: '-10px', left: '30px', background: '#F5F0EC', padding: '0 8px', fontSize: '13px', color: '#8D8D8D' }}>
              Email
            </span>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9B9B9B' }}>
              ✉
            </span>
            <input
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Your email address"
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '999px',
                border: '1.5px solid #BEB6B0',
                padding: '0 20px 0 44px',
                fontSize: '14px',
                background: 'transparent',
                outline: 'none',
                color: '#3D3D3D',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <span style={{ position: 'absolute', top: '-10px', left: '30px', background: '#F5F0EC', padding: '0 8px', fontSize: '13px', color: '#8D8D8D' }}>
              Password
            </span>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9B9B9B' }}>
              🔒
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Your password"
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '999px',
                border: '1.5px solid #BEB6B0',
                padding: '0 20px 0 44px',
                fontSize: '14px',
                background: 'transparent',
                outline: 'none',
                color: '#3D3D3D',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'none',
                color: '#5E5E5E',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                padding: 0,
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
            <button
              type="button"
              onClick={() => {}}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#5E5E5E',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                padding: 0,
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="button"
            onClick={async () => {
              setError('')
              setLoading(true)
              const result = await signIn({ email, password })
              setLoading(false)
              if (result.success) {
                navigate('/calendar')
              } else {
                setError(result.message)
              }
            }}
            disabled={!email || !password || loading}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '999px',
              background: '#EBCFB9',
              color: '#7D5632',
              fontSize: '18px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              opacity: !email || !password || loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && (
            <p style={{ color: '#C4908A', fontSize: '13px', textAlign: 'center', marginTop: '8px' }}>
              {error}
            </p>
          )}

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#A8A8A8', marginBottom: 0 }}>
            Don&apos;t have an account?{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault()
                navigate('/signup')
              }}
              style={{ color: '#C4908A', fontWeight: 600, textDecoration: 'none' }}
            >
              Sign up
            </a>
          </p>
        </div>

        <div style={{ width: '55%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: '420px',
              height: '520px',
              borderRadius: '210px 210px 0 0',
              background: '#EED7C6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={undrawDone}
                alt="illustration"
                style={{ width: '85%', height: '85%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
