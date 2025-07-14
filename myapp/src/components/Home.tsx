import { Link } from 'react-router-dom';
import logo from '../logo.png';

/**
 * Landing page shown at the root route. It features a black and white
 * theme with a detailed navbar and a hero section describing the AIMA
 * community and its key features.
 */
export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-aima">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="AIMA" />
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

      <header className="hero-aima py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="display-5 fw-bold">Welcome to AIMA</h1>
              <p className="lead">
                AIMA connects AI professionals with opportunities and a thriving community.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">&#8226; Browse and post AI jobs</li>
                <li className="mb-2">&#8226; Join groups and collaborate</li>
                <li className="mb-2">&#8226; Share knowledge and resources</li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-lg me-2">
                Join now
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg">
                Sign in
              </Link>
            </div>
            <div className="col-md-6 text-center">
              <img src={logo} alt="AIMA logo" className="img-fluid rounded" />
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
