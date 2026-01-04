import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function AdminDashboard({ user, onLogout }) {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedUsers, setExpandedUsers] = useState({})
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalInvitations: 0
    })
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/admin')
            return
        }
        fetchData()
    }, [user, navigate])

    const fetchData = async () => {
        try {
            // Fetch users
            const usersRes = await fetch('/api/users')
            const usersData = await usersRes.json()

            // Fetch invitations
            const invitationsRes = await fetch('/api/invitations')
            const invitationsData = await invitationsRes.json()

            if (usersData.success && invitationsData.success) {
                // Group invitations by user
                const usersWithInvitations = usersData.data.map(u => ({
                    ...u,
                    invitations: invitationsData.data.filter(inv => inv.user_id === u.id)
                }))

                setUsers(usersWithInvitations)
                setStats({
                    totalUsers: usersData.data.length,
                    totalInvitations: invitationsData.data.length
                })
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('adminUser')
        if (onLogout) {
            onLogout()
        }
        navigate('/admin')
    }

    const toggleUserExpand = (userId) => {
        setExpandedUsers(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }))
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!user) {
        return null
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <Link to="/" className="logo">
                    <span className="logo-icon">🚀</span>
                    InvitePro
                </Link>

                <nav className="admin-nav">
                    <button className="admin-nav-item active">
                        <span className="icon">📊</span>
                        <span>Dashboard</span>
                    </button>
                    <button className="admin-nav-item">
                        <span className="icon">👥</span>
                        <span>Users</span>
                    </button>
                    <button className="admin-nav-item">
                        <span className="icon">💌</span>
                        <span>Undangan</span>
                    </button>
                </nav>

                <div className="admin-logout">
                    <button onClick={handleLogout}>
                        <span className="icon">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1>Dashboard</h1>
                    <div className="admin-user-info">
                        <div className="avatar">
                            {user.nama?.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.nama}</span>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon purple">👥</div>
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon pink">💌</div>
                        <div className="stat-value">{stats.totalInvitations}</div>
                        <div className="stat-label">Total Undangan</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon cyan">📈</div>
                        <div className="stat-value">
                            {stats.totalUsers > 0
                                ? (stats.totalInvitations / stats.totalUsers).toFixed(1)
                                : 0}
                        </div>
                        <div className="stat-label">Rata-rata Undangan/User</div>
                    </div>
                </div>

                {/* Users with Invitations */}
                <div className="data-table-container">
                    <div className="data-table-header">
                        <h3>👥 Daftar Users & Undangan</h3>
                        <button className="btn btn-secondary" onClick={fetchData}>
                            🔄 Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon">📭</div>
                            <h4>Belum ada data</h4>
                            <p>Data users dan undangan akan muncul di sini</p>
                        </div>
                    ) : (
                        <div style={{ padding: '16px' }}>
                            {users.map(u => (
                                <div key={u.id} className="user-card">
                                    <div
                                        className={`user-card-header ${expandedUsers[u.id] ? 'expanded' : ''}`}
                                        onClick={() => toggleUserExpand(u.id)}
                                    >
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {u.nama?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="user-details">
                                                <h4>
                                                    {u.nama}
                                                    {u.role === 'admin' && (
                                                        <span className="badge admin" style={{ marginLeft: '8px' }}>
                                                            Admin
                                                        </span>
                                                    )}
                                                </h4>
                                                <p>{u.no_hp}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <span className="invitation-count">
                                                💌 {u.invitations?.length || 0} Undangan
                                            </span>
                                            <span className="toggle-icon">▼</span>
                                        </div>
                                    </div>

                                    <div className={`user-card-body ${expandedUsers[u.id] ? 'expanded' : ''}`}>
                                        {u.invitations?.length > 0 ? (
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Nama Tamu</th>
                                                        <th>No. HP</th>
                                                        <th>Alamat</th>
                                                        <th>Dibuat</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {u.invitations.map(inv => (
                                                        <tr key={inv.id}>
                                                            <td style={{ color: 'var(--text-primary)' }}>{inv.nama}</td>
                                                            <td>{inv.no_hp}</td>
                                                            <td>{inv.alamat}</td>
                                                            <td>{formatDate(inv.created_at)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="empty-state">
                                                <div className="icon">📭</div>
                                                <h4>Belum ada undangan</h4>
                                                <p>User ini belum membuat undangan</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default AdminDashboard
