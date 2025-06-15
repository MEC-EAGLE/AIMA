import { Link } from 'react-router-dom'

export default function Nav() {
  const handleLogout = () => {
    localStorage.removeItem('currentUser')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">AIMA</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create">Create</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/community">Community</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">Search</Link>
            </li>
          </ul>
          <button className="btn btn-outline-secondary" onClick={handleLogout}>
            <Link className="nav-link" to="/login">Logout</Link>
          </button>
        </div>
      </div>
    </nav>
  )
}
