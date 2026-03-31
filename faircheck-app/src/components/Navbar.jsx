import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <div className="logo-icon">🔍</div>
          <span>FairCheck AI</span>
        </a>
        {user && (
          <div className="navbar-user">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="user-avatar" />
            ) : (
              <div className="user-avatar" style={{
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="user-name">{user.name}</span>
            <button className="btn-logout" onClick={logout} id="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
