import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, saveUsers, hashString } from '../utils';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [type, setType] = useState('member');
  const [skills, setSkills] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const generic = ['info@', 'contact@', 'noreply@'];
    if (type === 'org' && generic.some(g => email.startsWith(g))) {
      alert('Please use a real contact email for your organization.');
      return;
    }
    const users = await getUsers();
    const hashed = await hashString(password);
    const newUser: any = {
      email,
      password: hashed,
      phone,
      contactName,
      type,
      verified: false,
      followers: [],
      groups: [],
      docs: [],
      profileRequests: [],
      profileShares: [],
      recommendations: [],
      resume: '',
      bio: '',
      events: [],
      notes: [],
      snoozed: false,
      blocked: [],
      resetCode: '',
    };
    if (type === 'member' || type === 'candidate') {
      newUser.skills = skills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s);
    }
    if (type === 'org') {
      newUser.peopleMap = [];
    }
    users.push(newUser);
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
          <label className="form-label">Contact Name</label>
          <input
            className="form-control"
            value={contactName}
            onChange={e => setContactName(e.target.value)}
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
          <select
            className="form-select"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="member">Community Member</option>
            <option value="candidate">Candidate</option>
            <option value="org">Organization</option>
          </select>
        </div>
        {type === 'member' && (
          <div className="mb-3">
            <label className="form-label">Skills (comma separated)</label>
            <input
              className="form-control"
              value={skills}
              onChange={e => setSkills(e.target.value)}
            />
          </div>
        )}
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
