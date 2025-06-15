import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, saveUsers } from '../utils';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('member');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const users = await getUsers();
    users.push({ email, password, phone, type, verified: false, followers: [], groups: [] });
    await saveUsers(users);
    alert('Verification link sent. Please verify to activate your account.');
    navigate(`/verify?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="container my-5" style={{ maxWidth: '420px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">User Type</label>
          <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
            <option value="member">Community Member</option>
            <option value="org">Organization</option>
          </select>
        </div>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
          <p className="mt-3 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
