import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Groups from './Groups';
import { getPosts, savePosts } from '../utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null as any);
  const [posts, setPosts] = useState([] as any[]);

  useEffect(() => {
    const u = localStorage.getItem('currentUser');
    if (!u) {
      navigate('/login');
    } else {
      const parsed = JSON.parse(u);
      setUser(parsed);
      async function load() {
        try {
          const p = await getPosts();
          setPosts(p);
        } catch (err) {
          console.error(err);
          alert('Failed to fetch posts');
        }
      }
      load();
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div>
      <Nav />
      <div className="container my-4">
        <h2>Dashboard</h2>
        <p>Welcome, {user.email}!</p>
        <Groups userEmail={user.email} />
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
                        try {
                          const all = await getPosts();
                          const idx = all.findIndex(x => x.id === p.id);
                          all[idx].applicants = all[idx].applicants.filter((a: string) => a !== user.email);
                          await savePosts(all);
                          setPosts(all);
                        } catch (err) {
                          console.error(err);
                          alert('Failed to update post');
                        }
                      }}
                    >
                    Withdraw
                  </button>
                ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={async () => {
                        try {
                          const all = await getPosts();
                          const idx = all.findIndex(x => x.id === p.id);
                          all[idx].applicants.push(user.email);
                          await savePosts(all);
                          setPosts(all);
                        } catch (err) {
                          console.error(err);
                          alert('Failed to update post');
                        }
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
