import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { getMessages, saveMessages } from '../utils'

export default function Chat() {
  const { email } = useParams()
  const current = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const [text, setText] = useState('')
  const msgs = getMessages().filter(m =>
    (m.from === current.email && m.to === email) ||
    (m.from === email && m.to === current.email)
  )

  const send = () => {
    if (!text) return
    const all = getMessages()
    all.push({ from: current.email, to: email!, text, timestamp: Date.now() })
    saveMessages(all)
    setText('')
  }

  return (
    <div className="container my-4">
      <h3>Chat with {email}</h3>
      <div style={{height: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px'}}>
        {msgs.map((m, i) => (
          <div key={i} className={m.from === current.email ? 'text-end' : 'text-start'}>
            <small>{m.from === current.email ? 'You' : m.from}</small>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <div className="input-group mt-2">
        <input className="form-control" value={text} onChange={e => setText(e.target.value)} />
        <button className="btn btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  )
}
