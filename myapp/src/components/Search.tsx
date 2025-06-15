import { useState, useEffect } from 'react';
import { getPosts } from '../utils';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([] as any[]);

  useEffect(() => {
    async function run() {
      try {
        const posts = await getPosts();
        const q = query.toLowerCase();
        setResults(posts.filter(p => p.title.toLowerCase().includes(q) || p.orgEmail.toLowerCase().includes(q)));
      } catch (err) {
        console.error(err);
        alert('Failed to fetch posts');
      }
    }
    run();
  }, [query]);

  return (
    <div className="container my-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Search</h2>
          <input
            className="form-control mb-3"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <ul className="list-group list-group-flush">
            {results.map(r => (
              <li key={r.id} className="list-group-item">
                <strong>{r.title}</strong> ({r.postType}) by {r.orgEmail}
                <p>{r.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
