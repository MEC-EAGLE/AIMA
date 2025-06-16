import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from './Nav';
import { getPosts, savePosts, getUsers, saveUsers } from '../utils';

export default function Jobs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null as any);
  const [posts, setPosts] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [hidden, setHidden] = useState(new Set<number>());
  const [saved, setSaved] = useState(new Set<number>());
  const [viewed, setViewed] = useState(new Set<number>());
  const [memberQuery, setMemberQuery] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('currentUser');
    if (!u) return navigate('/login');
    setUser(JSON.parse(u));
    Promise.all([getPosts(), getUsers()]).then(([p, us]) => {
      setPosts(p);
      setUsers(us);
    });
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
    if (!user.skills || user.skills.length === 0) {
      alert('Please complete your profile before applying.');
      return;
    }
    const all = await getPosts();
    const idx = all.findIndex(x => x.id === id);
    if (!all[idx].applicants.includes(user.email)) {
      all[idx].applicants.push(user.email);
      all[idx].statuses[user.email] = 'applied';
      await savePosts(all);
      setPosts(all);
    }
  };

  const withdraw = async (id: number) => {
    const all = await getPosts();
    const idx = all.findIndex(x => x.id === id);
    all[idx].applicants = all[idx].applicants.filter((a: string) => a !== user.email);
    delete all[idx].statuses[user.email];
    await savePosts(all);
    setPosts(all);
  };

  const updateStatus = async (postId: number, email: string, status: string) => {
    const all = await getPosts();
    const idx = all.findIndex(x => x.id === postId);
    all[idx].statuses[email] = status;
    await savePosts(all);
    setPosts(all);
  };

  const withdrawPost = async (postId: number) => {
    const all = await getPosts();
    const filtered = all.filter(p => p.id !== postId);
    await savePosts(filtered);
    setPosts(filtered);
  };

  const requestProfile = async (email: string) => {
    const all = await getUsers();
    const idx = all.findIndex(u => u.email === email);
    if (!all[idx].profileRequests) all[idx].profileRequests = [];
    if (!all[idx].profileRequests.includes(user.email)) {
      all[idx].profileRequests.push(user.email);
      await saveUsers(all);
      setUsers(all);
    }
  };

  const markViewed = (id: number) => {
    if (viewed.has(id)) return;
    const v = new Set(viewed);
    v.add(id);
    localStorage.setItem('viewedJobs', JSON.stringify(Array.from(v)));
    setViewed(v);
  };

  if (user.type === 'org') {
    const mine = posts.filter(p => p.authorEmail === user.email);
    const matchedMembers = users.filter(
      u =>
        u.type === 'member' &&
        memberQuery &&
        u.skills &&
        u.skills.some((s: string) =>
          s.toLowerCase().includes(memberQuery.toLowerCase())
        )
    );
    return (
      <div>
        <Nav />
        <div className="container my-4">
          <h2>Your Job Posts</h2>
          <a href="/create" className="btn btn-primary mb-3">
            Post a Job
          </a>
          {mine.map(p => (
            <div key={p.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p>{p.description}</p>
                <button
                  type="button"
                  className="btn btn-sm btn-danger mb-3"
                  onClick={() => withdrawPost(p.id)}
                >
                  Withdraw Post
                </button>
                <h6>Applicants</h6>
                <ul className="list-group mb-2">
                  {p.applicants.map(a => (
                    <li
                      key={a}
                      className="list-group-item"
                      style={{ opacity: p.statuses[a] === 'rejected' ? 0.5 : 1 }}
                    >
                      {(() => {
                        const cand = users.find(u => u.email === a);
                        if (!cand) return null;
                        return (
                          <>
                            <strong>{cand.contactName}</strong>{' '}
                            <span className="text-muted">
                              {(cand.skills || []).join(', ') || 'No skills'}
                            </span>
                            <Link
                              to={`/profile/${cand.email}`}
                              className="btn btn-sm btn-outline-info ms-2"
                            >
                              View Profile
                            </Link>
                          </>
                        );
                      })()}
                      <select
                        className="form-select form-select-sm mt-1"
                        value={p.statuses[a] || 'applied'}
                        onChange={e => updateStatus(p.id, a, e.target.value)}
                      >
                        <option value="applied">applied</option>
                        <option value="review">review</option>
                        <option value="interview">interview</option>
                        <option value="offer">offer</option>
                        <option value="rejected">rejected</option>
                      </select>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger mt-1 ms-2"
                        onClick={() => updateStatus(p.id, a, 'rejected')}
                      >
                        Reject
                      </button>
                      <Link
                        to="/interview"
                        className="btn btn-sm btn-outline-primary mt-1 ms-2"
                  >
                    Start Interview
                  </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div className="mt-4">
          <h4>Search Members</h4>
          <input
            className="form-control mb-2"
            placeholder="Search by skill"
            value={memberQuery}
            onChange={e => setMemberQuery(e.target.value)}
          />
            <ul className="list-group">
              {matchedMembers.map(c => (
                <li key={c.email} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {c.contactName} - {(c.skills || []).join(', ')}
                  </span>
                  {user.type === 'org' ? (
                    <Link
                      to={`/profile/${c.email}`}
                      className="btn btn-sm btn-outline-info"
                    >
                      View Profile
                    </Link>
                  ) : c.profileShares && c.profileShares.includes(user.email) ? (
                    <Link
                      to={`/profile/${c.email}`}
                      className="btn btn-sm btn-outline-info"
                    >
                      View Profile
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-info"
                      onClick={() => requestProfile(c.email)}
                      disabled={c.profileRequests && c.profileRequests.includes(user.email)}
                    >
                      {c.profileRequests && c.profileRequests.includes(user.email)
                        ? 'Requested'
                        : 'Request Profile'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

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
                  <strong>{p.title}</strong> ({p.postType}) by{' '}
                  {(users.find(u => u.email === p.authorEmail)?.contactName ||
                    p.authorEmail)}
                  {viewed.has(p.id) && (
                    <span className="badge bg-secondary ms-2">viewed</span>
                  )}
                  {saved.has(p.id) && (
                    <span className="badge bg-info text-dark ms-2">saved</span>
                  )}
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
                        disabled={!user.skills || user.skills.length === 0}
                        title={
                          !user.skills || user.skills.length === 0
                            ? 'Complete your profile to apply'
                            : undefined
                        }
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
