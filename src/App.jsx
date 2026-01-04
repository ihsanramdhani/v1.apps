import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './admin.css'
import LandingPage from './pages/LandingPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('adminUser')
    if (savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('adminUser')
      }
    }
  }, [])

  const handleLogin = (user) => {
    setAdminUser(user)
  }

  const handleLogout = () => {
    setAdminUser(null)
    localStorage.removeItem('adminUser')
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            adminUser ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            adminUser ? (
              <AdminDashboard user={adminUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
