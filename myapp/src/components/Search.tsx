import { useState, useEffect } from 'react';
import { getPosts } from '../utils';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([] as any[]);

  useEffect(() => {
    const posts = getPosts();
    const q = query.toLowerCase();
    setResults(posts.filter(p => p.title.toLowerCase().includes(q) || p.orgEmail.toLowerCase().includes(q)));
  }, [query]);

  return (
    <div className="container my-4">
      <h2>Search</h2>
      <input
        className="form-control mb-3"
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul className="list-group">
        {results.map(r => (
          <li key={r.id} className="list-group-item">
            <strong>{r.title}</strong> ({r.postType}) by {r.orgEmail}
            <p>{r.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
