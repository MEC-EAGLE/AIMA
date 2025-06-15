import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPosts, savePosts } from '../utils';

export default function Create() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null as any);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [postType, setPostType] = useState('job');

  useEffect(() => {
    const u = localStorage.getItem('currentUser');
    if (!u) return navigate('/login');
    const parsed = JSON.parse(u);
    if (parsed.type !== 'org') {
      alert('Only organizations can create posts.');
      navigate('/dashboard');
      return;
    }
    setUser(parsed);
  }, [navigate]);

  if (!user) return null;

  const submit = (e: any) => {
    e.preventDefault();
    const posts = getPosts();
    posts.push({ id: Date.now(), orgEmail: user.email, title, description, postType, tags: [], applicants: [] });
    savePosts(posts);
    alert('Created!');
    navigate('/dashboard');
  };

  return (
    <div className="container my-4" style={{ maxWidth: '600px' }}>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-3">Create Opportunity</h2>
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select className="form-select" value={postType} onChange={e => setPostType(e.target.value)}>
            <option value="job">Job</option>
            <option value="internship">Internship</option>
            <option value="volunteering">Volunteering</option>
            <option value="project">Project</option>
          </select>
        </div>
            <button className="btn btn-primary" type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}
