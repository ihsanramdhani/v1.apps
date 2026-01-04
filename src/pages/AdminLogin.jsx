import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin({ onLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Login gagal')
            }

            // Check if user is admin
            if (result.data.role !== 'admin') {
                throw new Error('Anda tidak memiliki akses admin')
            }

            // Save user to localStorage
            localStorage.setItem('adminUser', JSON.stringify(result.data))

            // Call onLogin callback
            if (onLogin) {
                onLogin(result.data)
            }

            // Redirect to dashboard
            navigate('/admin/dashboard')

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo">
                    <span className="logo-icon">🚀</span>
                    InvitePro
                </div>

                <h2>Admin Login</h2>
                <p className="subtitle">Masuk ke dashboard admin</p>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Masukkan Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Masukkan Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : '🔐 Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="/">← Kembali ke Beranda</a>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
