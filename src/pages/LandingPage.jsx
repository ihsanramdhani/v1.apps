import { useState, useEffect } from 'react'

function LandingPage() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            {/* Navigation */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <a href="#" className="logo">
                        <span className="logo-icon">🚀</span>
                        InvitePro
                    </a>

                    <div className="nav-links">
                        <a href="#features">Fitur</a>
                        <a href="#about">Tentang</a>
                        <a href="#pricing">Harga</a>
                        <a href="#contact">Kontak</a>
                    </div>

                    <div className="nav-cta">
                        <a href="/admin" className="btn btn-secondary" style={{ marginRight: '8px' }}>
                            🔐 Admin
                        </a>
                        <button className="btn btn-primary">Mulai Gratis</button>
                    </div>

                    <button className="mobile-menu-btn" aria-label="Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <div className="hero-badge">
                                <span className="dot"></span>
                                Platform Undangan Digital #1
                            </div>

                            <h1>
                                Buat Undangan <span className="gradient-text">Digital Elegan</span> dalam Hitungan Menit
                            </h1>

                            <p className="hero-description">
                                Platform undangan digital modern untuk pernikahan, ulang tahun, dan acara spesial lainnya.
                                Desain premium yang mengagumkan dengan kemudahan penggunaan.
                            </p>

                            <div className="hero-buttons">
                                <button className="btn btn-primary">
                                    🎉 Buat Undangan Sekarang
                                </button>
                                <button className="btn btn-secondary">
                                    Lihat Contoh →
                                </button>
                            </div>

                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-number">10K+</div>
                                    <div className="stat-label">Pengguna Aktif</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">50+</div>
                                    <div className="stat-label">Template Premium</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">99%</div>
                                    <div className="stat-label">Kepuasan</div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-visual">
                            <div className="hero-card">
                                <div className="hero-card-content">
                                    <div className="hero-icon">💍</div>
                                    <h3>Undangan Pernikahan</h3>
                                    <p>Template elegan untuk momen spesial Anda</p>
                                </div>
                            </div>

                            <div className="floating-element top-left">
                                <div className="icon purple">✨</div>
                                <div className="text">
                                    <strong>Desain Premium</strong>
                                    <span>50+ Template</span>
                                </div>
                            </div>

                            <div className="floating-element bottom-right">
                                <div className="icon pink">💝</div>
                                <div className="text">
                                    <strong>RSVP Digital</strong>
                                    <span>Kelola Tamu Mudah</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <div className="section-header">
                        <span className="subtitle">Fitur Unggulan</span>
                        <h2>Semua yang Anda Butuhkan <span className="gradient-text">dalam Satu Platform</span></h2>
                        <p>
                            Fitur lengkap untuk membuat undangan digital yang profesional dan mengesankan
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon purple">🎨</div>
                            <h3>Template Premium</h3>
                            <p>
                                Pilihan template elegan yang dirancang oleh desainer profesional untuk berbagai jenis acara.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon pink">📱</div>
                            <h3>Responsif Mobile</h3>
                            <p>
                                Undangan yang tampil sempurna di semua perangkat, dari desktop hingga smartphone.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon cyan">✅</div>
                            <h3>RSVP Digital</h3>
                            <p>
                                Kelola konfirmasi kehadiran tamu dengan mudah melalui sistem RSVP terintegrasi.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon purple">🎵</div>
                            <h3>Musik & Animasi</h3>
                            <p>
                                Tambahkan musik latar dan animasi untuk pengalaman undangan yang lebih hidup.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon pink">📊</div>
                            <h3>Statistik Lengkap</h3>
                            <p>
                                Pantau jumlah pengunjung, konfirmasi hadir, dan analitik lainnya secara real-time.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon cyan">🔗</div>
                            <h3>Link Kustom</h3>
                            <p>
                                Buat link undangan dengan nama custom yang mudah diingat dan dibagikan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta" id="contact">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2>Siap Membuat <span className="gradient-text">Undangan Impian</span> Anda?</h2>
                            <p>
                                Bergabung dengan ribuan pengguna yang telah mempercayakan momen spesial mereka kepada kami.
                            </p>
                            <button className="btn btn-primary">
                                🚀 Mulai Sekarang - Gratis!
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="logo">
                                <span className="logo-icon">🚀</span>
                                InvitePro
                            </div>
                            <p>
                                Platform undangan digital terpercaya untuk membuat momen spesial Anda lebih berkesan.
                            </p>
                            <div className="social-links">
                                <a href="#" className="social-link" aria-label="Facebook">📘</a>
                                <a href="#" className="social-link" aria-label="Instagram">📸</a>
                                <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                                <a href="#" className="social-link" aria-label="YouTube">📺</a>
                            </div>
                        </div>

                        <div className="footer-column">
                            <h4>Produk</h4>
                            <ul>
                                <li><a href="#">Undangan Pernikahan</a></li>
                                <li><a href="#">Undangan Ulang Tahun</a></li>
                                <li><a href="#">Undangan Khitanan</a></li>
                                <li><a href="#">Undangan Acara</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Perusahaan</h4>
                            <ul>
                                <li><a href="#">Tentang Kami</a></li>
                                <li><a href="#">Karir</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Kontak</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Dukungan</h4>
                            <ul>
                                <li><a href="#">Pusat Bantuan</a></li>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Tutorial</a></li>
                                <li><a href="#">Hubungi Kami</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2026 InvitePro. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <a href="#">Kebijakan Privasi</a>
                            <a href="#">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default LandingPage
