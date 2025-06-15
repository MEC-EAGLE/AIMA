import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUsers, saveUsers } from '../utils';

export default function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get('email') || '';

  const handleVerify = async () => {
    try {
      const users = await getUsers();
      const idx = users.findIndex(u => u.email === email);
      if (idx !== -1) {
        users[idx].verified = true;
        await saveUsers(users);
        alert('Account verified! You can now login.');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to verify account');
    }
  };

  if (!email) return <p>Invalid verification link</p>;

  return (
    <div className="container my-5" style={{ maxWidth: '420px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3">Verify Account</h2>
          <p>Click verify to activate your account for {email}.</p>
          <button type="button" className="btn btn-primary" onClick={handleVerify}>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
