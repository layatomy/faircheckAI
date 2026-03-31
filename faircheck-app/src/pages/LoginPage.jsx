import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleGoogleLogin = () => {
    // Simulate Google Sign-In (in production, integrate @react-oauth/google)
    login({
      name: 'Survey Analyst',
      email: 'analyst@faircheck.ai',
      picture: null,
    })
    navigate('/dashboard')
  }

  const handleDemoLogin = () => {
    login({
      name: 'Demo User',
      email: 'demo@faircheck.ai',
      picture: null,
    })
    navigate('/dashboard')
  }

  return (
    <div className="login-page" id="login-page">
      <div className="login-card glass-card">
        <div className="login-logo">🔍</div>
        <h1>FairCheck AI</h1>
        <p className="subtitle">
          Detect hidden biases in survey data before it's used for AI training or decision-making.
        </p>

        <button
          className="btn btn-google"
          onClick={handleGoogleLogin}
          id="google-signin-btn"
          style={{ width: '100%' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <div className="login-divider">Or</div>

        <button
          className="btn btn-secondary"
          onClick={handleDemoLogin}
          id="demo-signin-btn"
          style={{ width: '100%' }}
        >
          🚀 Continue as Demo User
        </button>

        <div className="login-features">
          <div className="login-feature">
            <div className="feature-icon detect">🔴</div>
            <span>Detect demographic & temporal biases</span>
          </div>
          <div className="login-feature">
            <div className="feature-icon measure">📊</div>
            <span>Measure bias with visual analytics</span>
          </div>
          <div className="login-feature">
            <div className="feature-icon mitigate">✅</div>
            <span>Get actionable mitigation suggestions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
