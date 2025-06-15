import { useState } from 'react'
import { getGroups, saveGroups } from '../utils'

export default function Groups({ userEmail }: { userEmail: string }) {
  const [name, setName] = useState('')
  const groups = getGroups().filter(g => g.members.includes(userEmail))

  const createGroup = () => {
    if (!name) return
    const all = getGroups()
    const id = Date.now()
    all.push({ id, name, members: [userEmail] })
    saveGroups(all)
    setName('')
  }

  return (
    <div className="my-3">
      <h4>Groups</h4>
      <ul>
        {groups.map(g => (
          <li key={g.id}>{g.name}</li>
        ))}
      </ul>
      <div className="input-group">
        <input className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="New group" />
        <button className="btn btn-secondary" onClick={createGroup}>Create</button>
      </div>
    </div>
  )
}
