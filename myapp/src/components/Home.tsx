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
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#homeNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="homeNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/jobs">
                  Jobs
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/community">
                  Community
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search">
                  Search
                </Link>
              </li>
            </ul>
            <div className="d-flex">
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
          <h1 className="display-4 fw-bold">Find your next AI opportunity</h1>
          <p className="lead mb-4">
            Search thousands of jobs and connect with leading organisations.
          </p>
          <form className="row g-2 justify-content-center">
            <div className="col-10 col-md-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Job title or keywords"
              />
            </div>
            <div className="col-10 col-md-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="City or remote"
              />
            </div>
            <div className="col-10 col-md-auto">
              <button type="submit" className="btn btn-primary btn-lg px-4">
                Search
              </button>
            </div>
          </form>
        </div>
      </header>

    </>
  );
}
