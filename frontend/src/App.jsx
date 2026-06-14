import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav style={{
        display: 'flex', gap: '20px', padding: '16px 24px',
        backgroundColor: '#1e1e2e', color: 'white'
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '18px', marginRight: 'auto' }}>
          RevMind AI — NovaBite
        </span>
        <NavLink to="/" style={({ isActive }) => ({
          color: isActive ? '#7c3aed' : 'white', textDecoration: 'none', fontWeight: '500'
        })}>Dashboard</NavLink>
        <NavLink to="/chat" style={({ isActive }) => ({
          color: isActive ? '#7c3aed' : 'white', textDecoration: 'none', fontWeight: '500'
        })}>Chat</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App