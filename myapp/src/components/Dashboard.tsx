import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { getPosts, savePosts, getUsers, getGroups } from '../utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null as any);
  const [posts, setPosts] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);
  const [allGroups, setAllGroups] = useState([] as any[]);

  useEffect(() => {
    const u = localStorage.getItem('currentUser');
    if (!u) {
      navigate('/login');
    } else {
      const parsed = JSON.parse(u);
      setUser(parsed);
      Promise.all([getPosts(), getUsers(), getGroups()]).then(
        ([p, us, gs]) => {
          setPosts(p);
          setUsers(us);
          setAllGroups(gs);
        }
      );
    }
  }, [navigate]);

  if (!user) return null;

  const memberGroups = allGroups.filter(g => g.members.includes(user.email));
  const otherMembers = users.filter(
    u => u.type === 'member' && u.email !== user.email
  );
  const orgsOffering = users.filter(
    u => u.type === 'org' && posts.some(p => p.orgEmail === u.email)
  );
  const otherOrgs = users.filter(
    u => u.type === 'org' && !posts.some(p => p.orgEmail === u.email)
  );

  return (
    <div>
      <Nav />
      <div className="container my-4">
        <h2>Dashboard</h2>
        <p>Welcome, Funny Bunny!</p>

        <h4>Member Settings</h4>
        <p>Email: {user.email}<br />Phone: {user.phone}</p>

        <h4>Member Profile</h4>
        <p>User type: {user.type}</p>

        <h4>Your Groups</h4>
        <ul className="list-group mb-3">
          {memberGroups.map(g => (
            <li key={g.id} className="list-group-item">{g.name}</li>
          ))}
        </ul>

        <h4>Other Members</h4>
        <ul className="list-group mb-3">
          {otherMembers.map(m => (
            <li key={m.email} className="list-group-item">{m.email}</li>
          ))}
        </ul>

        <h4>All Groups</h4>
        <ul className="list-group mb-3">
          {allGroups.map(g => (
            <li key={g.id} className="list-group-item">{g.name}</li>
          ))}
        </ul>

        <h4>Organizations Offering Work</h4>
        <ul className="list-group mb-3">
          {orgsOffering.map(o => (
            <li key={o.email} className="list-group-item">{o.email}</li>
          ))}
        </ul>

        <h4>Other Organizations</h4>
        <ul className="list-group mb-3">
          {otherOrgs.map(o => (
            <li key={o.email} className="list-group-item">{o.email}</li>
          ))}
        </ul>

        <h4>Help</h4>
        <p>Contact support for assistance.</p>

        <h4>Opportunities</h4>
        {posts.length === 0 && <p>No posts yet.</p>}
        <div className="card">
          <ul className="list-group list-group-flush">
            {posts.map(p => (
              <li key={p.id} className="list-group-item">
                <strong>{p.title}</strong> ({p.postType}) by {p.orgEmail}
                <p>{p.description}</p>
              {user.type === 'member' && (
                  p.applicants.includes(user.email) ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-warning"
                      onClick={async () => {
                        const all = await getPosts();
                        const idx = all.findIndex(x => x.id === p.id);
                        all[idx].applicants = all[idx].applicants.filter((a: string) => a !== user.email);
                        await savePosts(all);
                        setPosts(all);
                      }}
                    >
                    Withdraw
                  </button>
                ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={async () => {
                        const all = await getPosts();
                        const idx = all.findIndex(x => x.id === p.id);
                        all[idx].applicants.push(user.email);
                        await savePosts(all);
                        setPosts(all);
                      }}
                    >
                    Apply
                  </button>
                )
              )}
            </li>
          ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
