import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMessages, saveMessages, getGroups, getUsers } from '../utils';

export default function Chat() {
  const { email } = useParams();
  const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState([] as any[]);
  const [targetName, setTargetName] = useState(email || '');
  const [canChat, setCanChat] = useState(true);

  useEffect(() => {
    getMessages().then(all =>
      setMsgs(
        all.filter(m => {
          if (email?.startsWith('group-')) {
            return m.to === email;
          }
          return (
            (m.from === current.email && m.to === email) ||
            (m.from === email && m.to === current.email)
          );
        })
      )
    );
    if (!email) return;
    getUsers().then(us => {
      const me = us.find(u => u.email === current.email);
      const other = us.find(u => u.email === email);
      const blocked =
        other?.blocked?.includes(current.email) || me?.blocked?.includes(email);
      const snoozed = me?.snoozed || other?.snoozed;
      setCanChat(!blocked && !snoozed);
    });
    if (email?.startsWith('group-')) {
      const id = parseInt(email.slice(6), 10);
      getGroups().then(gs => {
        const g = gs.find(x => x.id === id);
        setTargetName(g ? g.name : email);
      });
    } else {
      setTargetName(email || '');
    }
  }, [email]);

  const send = async () => {
    if (!text || !canChat) return;
    const all = await getMessages();
    all.push({ from: current.email, to: email!, text, timestamp: Date.now() });
    await saveMessages(all);
    setMsgs(
      all.filter(m => {
        if (email?.startsWith('group-')) {
          return m.to === email;
        }
        return (
          (m.from === current.email && m.to === email) ||
          (m.from === email && m.to === current.email)
        );
      })
    );
    setText('');
  };

  return (
    <div className="container my-4" style={{ maxWidth: '500px' }}>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Chat with {targetName}</h3>
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
              disabled={!canChat}
            />
            <button type="button" className="btn btn-primary" onClick={send} disabled={!canChat}>
              Send
            </button>
          </div>
          {!canChat && (
            <div className="text-danger mt-2">Messaging is unavailable (blocked or snoozed)</div>
          )}
        </div>
      </div>
    </div>
  );
}
