import { Routes, Route, Navigate } from 'react-router-dom'
import Calendar from './components/Calendar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { RequireAuth, useAuth } from './context/AuthContext.jsx'

function App() {
  const auth = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
