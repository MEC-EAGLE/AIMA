import { Link } from 'react-router-dom';
import logo from '../logo.png';

/**
 * Landing page shown at the root route. It mimics a simple job search
 * layout similar to Indeed with a prominent hero section and search form.
 */
export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-indeed">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center" href="/">
            <img src={logo} alt="logo" />
          </a>
          <span className="navbar-text mx-auto">AIMA</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#homeNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="homeNavbar">
            <div className="ms-auto d-flex">
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-light py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Welcome to AIMA</h1>
          <p className="lead mb-4">AIMA connects AI enthusiasts with organisations to collaborate on projects and opportunities. Create job posts, join community groups and chat directly with other members.</p>
          <ul className="list-unstyled">
            <li>Post and apply for AI jobs</li>
            <li>Join interest-based groups and chat</li>
            <li>Manage notes, calendar and more</li>
          </ul>
        </div>
      </header>

    </>
  );
}
