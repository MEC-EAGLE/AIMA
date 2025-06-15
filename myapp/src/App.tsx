import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Verify from './components/Verify';
import Dashboard from './components/Dashboard';
import Create from './components/Create';
import Community from './components/Community';
import Search from './components/Search';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<Create />} />
        <Route path="/community" element={<Community />} />
        <Route path="/search" element={<Search />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/chat/:email" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;
