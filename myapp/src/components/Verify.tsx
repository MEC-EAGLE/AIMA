import { useNavigate, useSearchParams } from 'react-router-dom'
import { getUsers, saveUsers } from '../utils'

export default function Verify() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const email = params.get('email') || ''

  const handleVerify = () => {
    const users = getUsers()
    const idx = users.findIndex(u => u.email === email)
    if (idx !== -1) {
      users[idx].verified = true
      saveUsers(users)
      alert('Account verified! You can now login.')
      navigate('/login')
    }
  }

  if (!email) return <p>Invalid verification link</p>

  return (
    <div className="container my-5">
      <h2>Verify Account</h2>
      <p>Click verify to activate your account for {email}.</p>
      <button className="btn btn-primary" onClick={handleVerify}>Verify</button>
    </div>
  )
}
