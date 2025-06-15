import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, saveUsers } from '../utils';

export default function Community() {
  const [current, setCurrent] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('currentUser');
    if (!u) return navigate('/login');
    const me = JSON.parse(u);
    setCurrent(me);
    setUsers(getUsers().filter(x => x.email !== me.email));
  }, [navigate]);

  const toggleFollow = (email: string) => {
    const all = getUsers();
    const idx = all.findIndex(u => u.email === current.email);
    const followers = new Set(all[idx].followers);
    if (followers.has(email)) {
      followers.delete(email);
    } else {
      followers.add(email);
    }
    all[idx].followers = Array.from(followers);
    saveUsers(all);
    localStorage.setItem('currentUser', JSON.stringify(all[idx]));
    setUsers(getUsers().filter(x => x.email !== all[idx].email));
  };

  if (!current) return null;

  return (
    <div className="container my-4">
      <h2>Community</h2>
      <ul className="list-group">
        {users.map(u => (
          <li
            key={u.email}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{u.email}</span>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => toggleFollow(u.email)}
              >
                {current.followers.includes(u.email) ? 'Unfollow' : 'Follow'}
              </button>
              <Link to={`/chat/${u.email}`} className="btn btn-sm btn-secondary">
                Message
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
