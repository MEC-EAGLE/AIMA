import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMessages, saveMessages } from '../utils';

export default function Chat() {
  const { email } = useParams();
  const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState([] as any[]);

  useEffect(() => {
    (async () => {
      try {
        const all = await getMessages();
        setMsgs(
          all.filter(
            m =>
              (m.from === current.email && m.to === email) ||
              (m.from === email && m.to === current.email)
          )
        );
      } catch {
        alert('Failed to fetch messages');
      }
    })();
  }, [email]);

  const send = async () => {
    if (!text) return;
    try {
      const all = await getMessages();
      all.push({ from: current.email, to: email!, text, timestamp: Date.now() });
      await saveMessages(all);
      setMsgs(
        all.filter(
          m =>
            (m.from === current.email && m.to === email) ||
            (m.from === email && m.to === current.email)
        )
      );
      setText('');
    } catch {
      alert('Failed to send message');
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: '500px' }}>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Chat with {email}</h3>
          <div
            style={{
              height: '200px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '10px',
            }}
          >
            {msgs.map((m, i) => (
              <div key={i} className={m.from === current.email ? 'text-end' : 'text-start'}>
                <small>{m.from === current.email ? 'You' : m.from}</small>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <div className="input-group mt-2">
            <input
              className="form-control"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button type="button" className="btn btn-primary" onClick={send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
