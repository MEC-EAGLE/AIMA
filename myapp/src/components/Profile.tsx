import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from './Nav';
import { getUsers } from '../utils';

export default function Profile() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [viewer, setViewer] = useState(null as any);
  const [user, setUser] = useState(null as any);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return navigate('/login');
    const me = JSON.parse(stored);
    setViewer(me);
    getUsers().then(all => {
      const found = all.find((u: any) => u.email === email);
      if (!found) return navigate('/community');
      setUser(found);
    });
  }, [email, navigate]);

  if (!viewer || !user) return null;

  const allowed =
    viewer.email === user.email || (user.profileShares || []).includes(viewer.email);

  if (!allowed) {
    return (
      <div>
        <Nav />
        <div className="container my-4" style={{ maxWidth: '600px' }}>
          <h4>Profile access not granted.</h4>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="container my-4" style={{ maxWidth: '600px' }}>
        <h2>{user.contactName}'s Profile</h2>
        <p className="text-muted">Email: {user.email}</p>
        <h5>Skills</h5>
        <p>{(user.skills || []).join(', ') || 'No skills listed'}</p>
        {user.bio && (
          <div className="mb-2">
            <h5>Bio</h5>
            <p>{user.bio}</p>
          </div>
        )}
        {user.docs && user.docs.length > 0 && (
          <div>
            <h5>Documents</h5>
            <ul className="list-group">
              {user.docs.map((d: string, i: number) => (
                <li key={i} className="list-group-item">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
        {user.recommendations && user.recommendations.length > 0 && (
          <div className="mt-3">
            <h5>Recommendations</h5>
            <ul className="list-group">
              {user.recommendations.map((r: any, i: number) => (
                <li key={i} className="list-group-item">
                  <strong>{r.from}</strong>: {r.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
