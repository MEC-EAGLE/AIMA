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
          <span className="navbar-text mx-auto text-white">AIMA</span>
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
        <h2 className="mb-4 text-center">About the App</h2>
        <p className="lead">
          AIMA helps artificial intelligence enthusiasts connect, collaborate and
          learn together. Share resources in community forums, join group chats
          and manage projects all in one place. Discover job opportunities,
          upcoming events and a growing network of talented professionals.
        </p>
        <ul className="list-unstyled">
          <li>Build your professional profile</li>
          <li>Participate in discussions and group chats</li>
          <li>Post and find AI jobs and events</li>
          <li>Keep personal notes and tasks organised</li>
        </ul>
      </section>
    </>
  );
}
