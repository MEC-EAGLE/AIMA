import { useState, useEffect } from 'react';
import { getGroups, saveGroups } from '../utils';

export default function Groups({ userEmail }: { userEmail: string }) {
  const [name, setName] = useState('');
  const [groups, setGroups] = useState([] as any[]);

  useEffect(() => {
    async function load() {
      try {
        const all = await getGroups();
        setGroups(all.filter(g => g.members.includes(userEmail)));
      } catch (err) {
        console.error(err);
        alert('Failed to fetch groups');
      }
    }
    load();
  }, [userEmail]);

  const createGroup = async () => {
    if (!name) return;
    try {
      const all = await getGroups();
      const id = Date.now();
      all.push({ id, name, members: [userEmail] });
      await saveGroups(all);
      setGroups(all.filter(g => g.members.includes(userEmail)));
      setName('');
    } catch (err) {
      console.error(err);
      alert('Failed to create group');
    }
  };

  return (
    <div className="my-3">
      <h4>Groups</h4>
      <ul className="list-group mb-2">
        {groups.map(g => (
          <li key={g.id} className="list-group-item">
            {g.name}
          </li>
        ))}
      </ul>
      <div className="input-group">
        <input
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New group"
        />
        <button type="button" className="btn btn-secondary" onClick={createGroup}>
          Create
        </button>
      </div>
    </div>
  );
}
