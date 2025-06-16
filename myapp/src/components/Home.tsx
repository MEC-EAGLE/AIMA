import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container my-5 text-center">
      <div className="p-5 mb-4 bg-light rounded-3">
        <h1 className="display-5 fw-bold">AI Opportunities</h1>
        <p className="col-lg-8 mx-auto fs-4">
          Please login or register to continue.
        </p>
        <Link className="btn btn-primary me-2" to="/login">
          Login
        </Link>
        <Link className="btn btn-outline-secondary" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}
