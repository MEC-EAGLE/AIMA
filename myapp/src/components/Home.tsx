import { Link } from 'react-router-dom';
import logo from '../logo.png';

/**
 * Landing page shown at the root route. It now mimics the layout of
 * LinkedIn's public home page with a clean navbar and a hero section
 * encouraging users to join the community.
 */
export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-linkedin">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#homeNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="homeNavbar">
            <div className="ms-auto d-flex align-items-center">
              <Link to="/register" className="btn btn-outline-primary me-2">
                Join now
              </Link>
              <Link to="/login" className="btn btn-primary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="hero-linkedin py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="display-5 fw-bold">Welcome to your AI professional community</h1>
              <p className="lead">Build connections, find opportunities and collaborate on exciting projects.</p>
              <Link to="/register" className="btn btn-primary btn-lg">Join now</Link>
            </div>
            <div className="col-md-6 text-center">
              <img src={logo} alt="AIMA" className="img-fluid rounded" />
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
