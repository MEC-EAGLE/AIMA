import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { getPosts, savePosts, getUsers, getGroups, saveUsers } from '../utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null as any);
  const [posts, setPosts] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);
  const [allGroups, setAllGroups] = useState([] as any[]);
  const [active, setActive] = useState('welcome');

  useEffect(() => {
    const u = localStorage.getItem('currentUser');
    if (!u) {
      navigate('/login');
    } else {
      const parsed = JSON.parse(u);
      setUser(parsed);
      setResumeText(parsed.resume || '');
      setBio(parsed.bio || '');
      setSkillsInput((parsed.skills || []).join(', '));
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
    u =>
      (u.type === 'member' || u.type === 'candidate') && u.email !== user.email
  );
  const orgsOffering = users.filter(
    u => u.type === 'org' && posts.some(p => p.authorEmail === u.email)
  );
  const otherOrgs = users.filter(
    u => u.type === 'org' && !posts.some(p => p.authorEmail === u.email)
  );

  const canComment = (p: any) => {
    if (p.authorType === 'member') {
      if (p.authorEmail === user.email) return true;
      const contact = user.followers.includes(p.authorEmail);
      const sameGroup = allGroups.some(
        g => g.members.includes(user.email) && g.members.includes(p.authorEmail)
      );
      return contact || sameGroup;
    }
    if (p.authorType === 'org') {
      return user.type === 'member' || user.type === 'candidate';
    }
    return false;
  };

  const [commentText, setCommentText] = useState({} as any);
  const [resumeText, setResumeText] = useState('');
  const [bio, setBio] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [docName, setDocName] = useState('');

  return (
    <div>
      <Nav />
      <div className="container my-4">
        <h2>Dashboard</h2>
        <p>Welcome, Funny Bunny!</p>

        <nav className="nav nav-pills flex-wrap mb-3">
          <button
            type="button"
            className={`nav-link ${active === 'welcome' ? 'active' : ''}`}
            onClick={() => setActive('welcome')}
          >
            Welcome
          </button>
          <button
            type="button"
            className={`nav-link ${active === 'settings' ? 'active' : ''}`}
            onClick={() => setActive('settings')}
          >
            Member settings
          </button>
          <button
            type="button"
            className={`nav-link ${active === 'profile' ? 'active' : ''}`}
            onClick={() => setActive('profile')}
          >
            Member profile
          </button>
          <button
            type="button"
            className={`nav-link ${active === 'member-groups' ? 'active' : ''}`}
            onClick={() => setActive('member-groups')}
          >
            Your groups
          </button>
          <button
            type="button"
            className={`nav-link ${active === 'other-members' ? 'active' : ''}`}
            onClick={() => setActive('other-members')}
          >
            Other members
          </button>
          <button
            type="button"
            className={`nav-link ${active === 'all-groups' ? 'active' : ''}`}
            onClick={() => setActive('all-groups')}
          >
            All groups
          </button>
          <button
            type="button"
            className={`nav-link ${active === 'orgs-offering' ? 'active' : ''}`}
            onClick={() => setActive('orgs-offering')}
          >
            Orgs offering work
          </button>
          <button
            type="button"
            className={`nav-link ${active === 'other-orgs' ? 'active' : ''}`}
            onClick={() => setActive('other-orgs')}
          >
            Other orgs
          </button>
          <button
            type="button"
            className={`nav-link ${active === 'help' ? 'active' : ''}`}
            onClick={() => setActive('help')}
          >
            Help
          </button>
        </nav>

        {active === 'welcome' && (
          <div>
            <h4>Welcome</h4>
            <p>Welcome, Funny Bunny!</p>
          </div>
        )}

        {active === 'settings' && (
          <div>
            <h4>Member Settings</h4>
            <p>
              Email: {user.email}
              <br />
              Phone: {user.phone}
            </p>
          </div>
        )}

        {active === 'profile' && (
          <div style={{ maxWidth: '600px' }}>
            <h4>Member Profile</h4>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const all = await getUsers();
                const idx = all.findIndex(u => u.email === user.email);
                all[idx].resume = resumeText;
                all[idx].bio = bio;
                all[idx].skills = skillsInput
                  .split(',')
                  .map(s => s.trim())
                  .filter(s => s);
                all[idx].docs = user.docs || [];
                await saveUsers(all);
                localStorage.setItem('currentUser', JSON.stringify(all[idx]));
                setUser(all[idx]);
              }}
            >
              <div className="mb-3">
                <label className="form-label">Skills (comma separated)</label>
                <input
                  className="form-control"
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Resume Text</label>
                <textarea
                  className="form-control"
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-secondary mt-1"
                  onClick={() => {
                    const match = resumeText.match(/skills?:\s*(.*)/i);
                    if (match) setSkillsInput(match[1]);
                    if (!bio) setBio(resumeText.slice(0, 200));
                  }}
                >
                  Upload Resume
                </button>
              </div>
              <div className="mb-3">
                <label className="form-label">Add Document</label>
                <input
                  className="form-control"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-secondary mt-1"
                  onClick={() => {
                    if (!docName) return;
                    const docs = user.docs ? [...user.docs, docName] : [docName];
                    setUser({ ...user, docs });
                    setDocName('');
                  }}
                >
                  Add Document
                </button>
              </div>
              {user.docs && user.docs.length > 0 && (
                <ul className="list-group mb-3">
                  {user.docs.map((d: string, i: number) => (
                    <li key={i} className="list-group-item">
                      {d}
                    </li>
                  ))}
                </ul>
              )}
              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
            </form>

            <div className="mt-4">
              <h5>Profile View Requests</h5>
              <ul className="list-group">
                {(user.profileRequests || []).map((r: string) => (
                  <li key={r} className="list-group-item d-flex justify-content-between align-items-center">
                    {r}
                    <span>
                      <button
                        type="button"
                        className="btn btn-sm btn-success me-2"
                        onClick={async () => {
                          const all = await getUsers();
                          const idx = all.findIndex(u => u.email === user.email);
                          all[idx].profileRequests = all[idx].profileRequests.filter((x: string) => x !== r);
                          all[idx].profileShares = [...(all[idx].profileShares || []), r];
                          await saveUsers(all);
                          localStorage.setItem('currentUser', JSON.stringify(all[idx]));
                          setUser(all[idx]);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={async () => {
                          const all = await getUsers();
                          const idx = all.findIndex(u => u.email === user.email);
                          all[idx].profileRequests = all[idx].profileRequests.filter((x: string) => x !== r);
                          await saveUsers(all);
                          localStorage.setItem('currentUser', JSON.stringify(all[idx]));
                          setUser(all[idx]);
                        }}
                      >
                        Decline
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {user.recommendations && user.recommendations.length > 0 && (
              <div className="mt-4">
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
        )}

        {active === 'member-groups' && (
          <div>
            <h4>Your Groups</h4>
            <ul className="list-group mb-3">
              {memberGroups.map(g => (
                <li key={g.id} className="list-group-item">
                  {g.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === 'other-members' && (
          <div>
            <h4>Other Members</h4>
            <ul className="list-group mb-3">
              {otherMembers.map(m => (
                <li key={m.email} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{m.email}</span>
                  {m.skills && m.skills.length > 0 && user.skills && user.skills.length > 0 && m.bio && m.resume && user.bio && user.resume && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      onClick={async () => {
                        const text = prompt('Enter your recommendation');
                        if (!text) return;
                        const all = await getUsers();
                        const idx = all.findIndex(u => u.email === m.email);
                        if (!all[idx].recommendations) all[idx].recommendations = [];
                        all[idx].recommendations.push({ from: user.email, text, timestamp: Date.now() });
                        await saveUsers(all);
                        setUsers(all);
                      }}
                    >
                      Recommend
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === 'all-groups' && (
          <div>
            <h4>All Groups</h4>
            <ul className="list-group mb-3">
              {allGroups.map(g => (
                <li key={g.id} className="list-group-item">
                  {g.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === 'orgs-offering' && (
          <div>
            <h4>Organizations Offering Work</h4>
            <ul className="list-group mb-3">
              {orgsOffering.map(o => (
                <li key={o.email} className="list-group-item">
                  {o.email}
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === 'other-orgs' && (
          <div>
            <h4>Other Organizations</h4>
            <ul className="list-group mb-3">
              {otherOrgs.map(o => (
                <li key={o.email} className="list-group-item">
                  {o.email}
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === 'help' && (
          <div>
            <h4>Help</h4>
            <p>Contact support for assistance.</p>
          </div>
        )}

        <h4>Opportunities</h4>
        {posts.length === 0 && <p>No posts yet.</p>}
        <div className="card">
          <ul className="list-group list-group-flush">
            {posts.map(p => (
              <li key={p.id} className="list-group-item">
                <strong>{p.title}</strong> ({p.postType}) by {p.authorEmail}
                <p>{p.description}</p>
                {(user.type === 'member' || user.type === 'candidate') && (
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
                        if (
                          user.type === 'candidate' && (!user.skills || user.skills.length === 0)
                        ) {
                          alert('Please complete your profile before applying.');
                          return;
                        }
                        const all = await getPosts();
                        const idx = all.findIndex(x => x.id === p.id);
                        all[idx].applicants.push(user.email);
                        await savePosts(all);
                        setPosts(all);
                      }}
                      disabled={
                        user.type === 'candidate' && (!user.skills || user.skills.length === 0)
                      }
                      title={
                        user.type === 'candidate' && (!user.skills || user.skills.length === 0)
                          ? 'Complete your profile to apply'
                          : undefined
                      }
                    >
                      Apply
                    </button>
                  )
                )}
                {p.applicants.includes(user.email) && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Status: {p.statuses[user.email] || 'applied'}
                    </small>
                  </div>
                )}
                <div className="mt-2">
                  <strong>Comments</strong>
                  <ul className="list-group mb-2">
                    {p.comments.map((c: any, i: number) => (
                      <li key={i} className="list-group-item">
                        <small>{c.userEmail}</small>: {c.text}
                      </li>
                    ))}
                  </ul>
                  {canComment(p) && (
                    <form
                      className="d-flex"
                      onSubmit={async e => {
                        e.preventDefault();
                        const text = commentText[p.id] || '';
                        if (!text) return;
                        const all = await getPosts();
                        const idx = all.findIndex(x => x.id === p.id);
                        all[idx].comments.push({
                          userEmail: user.email,
                          text,
                          timestamp: Date.now(),
                        });
                        await savePosts(all);
                        setPosts(all);
                        setCommentText({ ...commentText, [p.id]: '' });
                      }}
                    >
                      <input
                        className="form-control form-control-sm me-2"
                        value={commentText[p.id] || ''}
                        onChange={e =>
                          setCommentText({
                            ...commentText,
                            [p.id]: e.target.value,
                          })
                        }
                      />
                      <button type="submit" className="btn btn-sm btn-secondary">
                        Comment
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
