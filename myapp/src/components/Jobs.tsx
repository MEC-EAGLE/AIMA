import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { getPosts, savePosts } from '../utils';

export default function Jobs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null as any);
  const [posts, setPosts] = useState([] as any[]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [hidden, setHidden] = useState(new Set<number>());
  const [saved, setSaved] = useState(new Set<number>());
  const [viewed, setViewed] = useState(new Set<number>());

  useEffect(() => {
    const u = localStorage.getItem('currentUser');
    if (!u) return navigate('/login');
    setUser(JSON.parse(u));
    getPosts().then(setPosts);
    setHidden(new Set(JSON.parse(localStorage.getItem('hiddenJobs') || '[]')));
    setSaved(new Set(JSON.parse(localStorage.getItem('savedJobs') || '[]')));
    setViewed(new Set(JSON.parse(localStorage.getItem('viewedJobs') || '[]')));
  }, [navigate]);

  if (!user) return null;

  const saveState = (
    key: string,
    set: Set<number>,
    setter: (s: Set<number>) => void,
    id: number
  ) => {
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    const arr = Array.from(set);
    localStorage.setItem(key, JSON.stringify(arr));
    setter(new Set(arr));
  };

  const filtered = posts.filter(
    p => !hidden.has(p.id) && (filter === 'all' || p.postType === filter)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title);
    return b.id - a.id;
  });

  const apply = async (id: number) => {
    const all = await getPosts();
    const idx = all.findIndex(x => x.id === id);
    if (!all[idx].applicants.includes(user.email)) {
      all[idx].applicants.push(user.email);
      await savePosts(all);
      setPosts(all);
    }
  };

  const withdraw = async (id: number) => {
    const all = await getPosts();
    const idx = all.findIndex(x => x.id === id);
    all[idx].applicants = all[idx].applicants.filter((a: string) => a !== user.email);
    await savePosts(all);
    setPosts(all);
  };

  const markViewed = (id: number) => {
    if (viewed.has(id)) return;
    const v = new Set(viewed);
    v.add(id);
    localStorage.setItem('viewedJobs', JSON.stringify(Array.from(v)));
    setViewed(v);
  };

  return (
    <div>
      <Nav />
      <div className="container my-4">
        <h2>Opportunities</h2>
        <div className="mb-3 d-flex">
          <select
            className="form-select me-2"
            style={{ maxWidth: '200px' }}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="job">Jobs</option>
            <option value="internship">Internships</option>
            <option value="volunteering">Volunteering</option>
            <option value="project">Projects</option>
          </select>
          <select
            className="form-select"
            style={{ maxWidth: '200px' }}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="recent">Recent</option>
            <option value="title">Title</option>
          </select>
        </div>
        {sorted.length === 0 && <p>No posts.</p>}
        <ul className="list-group">
          {sorted.map(p => (
            <li
              key={p.id}
              className="list-group-item"
              onClick={() => markViewed(p.id)}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{p.title}</strong> ({p.postType}) by {p.orgEmail}
                  {viewed.has(p.id) && <span className="badge bg-secondary ms-2">viewed</span>}
                  {saved.has(p.id) && <span className="badge bg-info text-dark ms-2">saved</span>}
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={e => {
                      e.stopPropagation();
                      saveState('savedJobs', saved, setSaved, p.id);
                    }}
                  >
                    {saved.has(p.id) ? 'Unsave' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={e => {
                      e.stopPropagation();
                      saveState('hiddenJobs', hidden, setHidden, p.id);
                    }}
                  >
                    Hide
                  </button>
                  {user.type === 'member' && (
                    p.applicants.includes(user.email) ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={e => {
                          e.stopPropagation();
                          withdraw(p.id);
                        }}
                      >
                        Withdraw
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={e => {
                          e.stopPropagation();
                          apply(p.id);
                        }}
                      >
                        Apply
                      </button>
                    )
                  )}
                </div>
              </div>
              <p className="mb-1">{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
