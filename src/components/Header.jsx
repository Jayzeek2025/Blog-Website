import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useContext(AuthContext)

  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/articles">Blog</Link>

        <div>
          {!user ? (
            <>
              <Link to="/sign-in" style={{ marginRight: '1rem' }}>
                Sign In
              </Link>
              <Link to="/sign-up">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/new-article" style={{ marginRight: '1rem' }}>
                New Article
              </Link>

              <Link to="/profile" style={{ marginRight: '1rem' }}>
                {user.username}
              </Link>

              <button
                onClick={logout}
                style={{
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}