import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, saveUsers, getGroups, saveGroups } from '../utils';

export default function Community() {
  const [current, setCurrent] = useState(null as any);
  const [users, setUsers] = useState([] as any[]);
  const [groups, setGroups] = useState([] as any[]);
  const [view, setView] = useState('members' as 'members' | 'groups');
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('currentUser');
    if (!u) return navigate('/login');
    const me = JSON.parse(u);
    setCurrent(me);
    getUsers().then(all => setUsers(all.filter(x => x.email !== me.email)));
    getGroups().then(gs => setGroups(gs));
  }, [navigate]);

  const toggleFollow = async (email: string) => {
    const all = await getUsers();
    const idx = all.findIndex(u => u.email === current.email);
    const followers = new Set(all[idx].followers);
    if (followers.has(email)) {
      followers.delete(email);
    } else {
      followers.add(email);
    }
    all[idx].followers = Array.from(followers);
    await saveUsers(all);
    localStorage.setItem('currentUser', JSON.stringify(all[idx]));
    setUsers(all.filter(x => x.email !== all[idx].email));
  };

  const toggleJoinGroup = async (id: number) => {
    const all = await getGroups();
    const idx = all.findIndex(g => g.id === id);
    const members = new Set(all[idx].members);
    if (members.has(current.email)) {
      members.delete(current.email);
    } else {
      members.add(current.email);
    }
    all[idx].members = Array.from(members);
    await saveGroups(all);
    setGroups(all);
  };

  const requestProfile = async (email: string) => {
    const all = await getUsers();
    const idx = all.findIndex(u => u.email === email);
    if (!all[idx].profileRequests) all[idx].profileRequests = [];
    if (!all[idx].profileRequests.includes(current.email)) {
      all[idx].profileRequests.push(current.email);
      await saveUsers(all);
      setUsers(all.filter(x => x.email !== current.email));
    }
  };

  if (!current) return null;

  return (
    <div className="container my-4" style={{ maxWidth: '600px' }}>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-3">Community</h2>
          <nav className="nav nav-tabs mb-3">
            <button
              type="button"
              className={`nav-link ${view === 'members' ? 'active' : ''}`}
              onClick={() => setView('members')}
            >
              Members
            </button>
            <button
              type="button"
              className={`nav-link ${view === 'groups' ? 'active' : ''}`}
              onClick={() => setView('groups')}
            >
              Groups
            </button>
          </nav>
          {view === 'members' && (
            <ul className="list-group list-group-flush">
              {users.map(u => (
                <li
                  key={u.email}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{u.email}</span>
                  <div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => toggleFollow(u.email)}
                    >
                      {current.followers.includes(u.email) ? 'Unfollow' : 'Follow'}
                    </button>
                    {u.profileShares && u.profileShares.includes(current.email) ? (
                      <Link
                        to={`/profile/${u.email}`}
                        className="btn btn-sm btn-outline-info me-2"
                      >
                        View Profile
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info me-2"
                        onClick={() => requestProfile(u.email)}
                        disabled={u.profileRequests && u.profileRequests.includes(current.email)}
                      >
                        {u.profileRequests && u.profileRequests.includes(current.email)
                          ? 'Requested'
                          : 'Request Profile'}
                      </button>
                    )}
                    <Link to={`/chat/${u.email}`} className="btn btn-sm btn-secondary">
                      Message
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {view === 'groups' && (
            <ul className="list-group list-group-flush">
              {groups.map(g => (
                <li
                  key={g.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{g.name}</span>
                  <div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => toggleJoinGroup(g.id)}
                    >
                      {g.members.includes(current.email) ? 'Leave' : 'Join'}
                    </button>
                    <Link
                      to={`/chat/group-${g.id}`}
                      className="btn btn-sm btn-secondary"
                    >
                      Message
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
