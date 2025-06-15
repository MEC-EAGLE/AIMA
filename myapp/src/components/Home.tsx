import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container my-5">
      <h1 className="mb-3">Welcome to AI Opportunities</h1>
      <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to continue.</p>
    </div>
  )
}
