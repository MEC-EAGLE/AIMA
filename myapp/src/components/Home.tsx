import { Link } from 'react-router-dom';
import logo from '../AIMA_LOG.png';

/**
 * Landing page shown at the root route. The home page introduces
 * visitors to the AIMA community and encourages them to join.
 */
export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-indeed">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center" href="/">
            <img src={logo} alt="logo" />
          </a>
          <div className="ms-auto">
            <Link to="/login" className="btn btn-light me-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-light">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <header className="bg-light py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Welcome to AIMA</h1>
          <p className="lead mb-0">
            The Artificial Intelligence Members Association (AIMA) is a global
            network for professionals, students and organisations interested in
            advancing the field of AI. Connect with peers, discover resources
            and explore opportunities in a collaborative environment.
          </p>
        </div>
      </header>

      <section className="container my-5">
        <h2 className="mb-4 text-center">Popular categories</h2>
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded text-center bg-white">
              Machine Learning
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded text-center bg-white">
              Data Science
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded text-center bg-white">
              Computer Vision
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded text-center bg-white">Robotics</div>
          </div>
        </div>
      </section>
    </>
  );
}
