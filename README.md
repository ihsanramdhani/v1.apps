# InvitePro - Landing Page Application

Platform undangan digital modern dengan React, Vercel Serverless Functions, dan Supabase.

## 🚀 Teknologi

- **Frontend**: React 19 + Vite 7
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router DOM
- **Deployment**: Vercel

---

## 📊 Flowchart Aplikasi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INVITEPRO APPLICATION                              │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────┐
                                    │  START   │
                                    └────┬─────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │   User Visits URL   │
                              └──────────┬──────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         │                               │
                         ▼                               ▼
              ┌──────────────────┐            ┌──────────────────┐
              │  Landing Page    │            │   Admin Login    │
              │      (/)         │            │    (/admin)      │
              └──────────────────┘            └────────┬─────────┘
                                                       │
                                                       ▼
                                              ┌────────────────┐
                                              │ Enter Username │
                                              │  & Password    │
                                              └───────┬────────┘
                                                      │
                                                      ▼
                                            ┌──────────────────┐
                                            │  POST /api/auth  │
                                            │     /login       │
                                            └────────┬─────────┘
                                                     │
                                                     ▼
                                            ┌────────────────┐
                                            │ Supabase RPC:  │
                                            │verify_user_login│
                                            └───────┬────────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    │                               │
                               (Success)                       (Failed)
                                    │                               │
                                    ▼                               ▼
                          ┌─────────────────┐            ┌─────────────────┐
                          │ Store User in   │            │   Show Error    │
                          │  localStorage   │            │    Message      │
                          └────────┬────────┘            └─────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Redirect to     │
                          │ /admin/dashboard│
                          └────────┬────────┘
                                   │
                                   ▼
                        ┌────────────────────┐
                        │   Admin Dashboard  │
                        └────────┬───────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐
          │ GET /api/users  │       │GET /api/invitations│
          └────────┬────────┘       └────────┬────────┘
                   │                         │
                   ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐
          │ Supabase Query  │       │ Supabase Query  │
          │  SELECT users   │       │SELECT invitations│
          └────────┬────────┘       └────────┬────────┘
                   │                         │
                   └───────────┬─────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Display Users with  │
                    │ Their Invitations   │
                    └─────────────────────┘
```

### Database Entity Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                          │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐         ┌──────────────────────┐
    │        USERS         │         │   USER_INVITATION    │
    ├──────────────────────┤         ├──────────────────────┤
    │ id (UUID) [PK]       │───┐     │ id (UUID) [PK]       │
    │ username (VARCHAR)   │   │     │ user_id (UUID) [FK]  │◄──┘
    │ nama (VARCHAR)       │   └────►│ nama (VARCHAR)       │
    │ no_hp (VARCHAR)      │         │ no_hp (VARCHAR)      │
    │ password (TEXT)      │         │ alamat (TEXT)        │
    │ role (VARCHAR)       │         │ created_at           │
    │ created_at           │         │ updated_at           │
    │ updated_at           │         └──────────────────────┘
    └──────────────────────┘
    
    Relationship: One User → Many Invitations (1:N)
```

---

## 📁 Struktur Project

```
v1.apps/
├── api/                          # Vercel Serverless Functions
│   ├── auth/
│   │   └── login.js             # POST /api/auth/login
│   ├── users.js                 # GET/POST /api/users
│   └── invitations.js           # GET/POST /api/invitations
├── src/
│   ├── lib/
│   │   └── supabase.js          # Supabase client (frontend)
│   ├── pages/
│   │   ├── LandingPage.jsx      # Landing page component
│   │   ├── AdminLogin.jsx       # Admin login form
│   │   └── AdminDashboard.jsx   # Admin dashboard
│   ├── App.jsx                  # Main app with routing
│   ├── App.css
│   ├── index.css                # Global styles
│   ├── admin.css                # Admin-specific styles
│   └── main.jsx                 # Entry point
├── supabase/
│   ├── schema.sql               # Full database schema
│   ├── migration_add_password.sql
│   └── verify_password.sql      # Password verification function
├── .env                         # Environment variables (local)
├── .env.example                 # Environment template
├── vercel.json                  # Vercel configuration
└── package.json
```

---

## 🗄️ Database Schema

### Table: users
| Column     | Type         | Description              |
|------------|--------------|--------------------------|
| id         | UUID         | Primary key              |
| username   | VARCHAR(100) | Unique username          |
| nama       | VARCHAR(255) | Nama user                |
| no_hp      | VARCHAR(20)  | Nomor HP                 |
| password   | TEXT         | Encrypted password (bcrypt) |
| role       | VARCHAR(20)  | 'user' or 'admin'        |
| created_at | TIMESTAMP    | Waktu dibuat             |
| updated_at | TIMESTAMP    | Waktu terakhir diupdate  |

### Table: user_invitation
| Column     | Type         | Description              |
|------------|--------------|--------------------------|
| id         | UUID         | Primary key              |
| user_id    | UUID         | Foreign key ke users     |
| nama       | VARCHAR(255) | Nama tamu undangan       |
| no_hp      | VARCHAR(20)  | Nomor HP tamu            |
| alamat     | TEXT         | Alamat tamu              |
| created_at | TIMESTAMP    | Waktu dibuat             |
| updated_at | TIMESTAMP    | Waktu terakhir diupdate  |

---

## 🛠️ Setup & Installation

### 1. Clone & Install

```bash
git clone <repository-url>
cd v1.apps
npm install
```

### 2. Setup Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat/pilih project
3. Buka **SQL Editor**
4. Jalankan file `supabase/schema.sql`
5. Ambil kredensial dari **Settings > API**

### 3. Setup Environment Variables

Buat file `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Set Environment Variables di Vercel

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_SECRET_KEY
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

---

## 🔐 Admin Credentials

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

---

## 📡 API Endpoints

### Authentication

**POST /api/auth/login**
```json
// Request
{
  "username": "admin",
  "password": "admin123"
}

// Response (Success)
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "nama": "Administrator",
    "no_hp": "08123456789",
    "role": "admin"
  },
  "message": "Login berhasil"
}

// Response (Error)
{
  "success": false,
  "error": "Username atau Password salah"
}
```

### Users

**GET /api/users**
```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "admin",
      "nama": "Administrator",
      "no_hp": "08123456789",
      "role": "admin"
    }
  ]
}
```

### Invitations

**GET /api/invitations**
```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "nama": "Budi",
      "no_hp": "081234567890",
      "alamat": "Jakarta"
    }
  ]
}
```

---

## 🐛 Debugging Guide

### Step 1: Identifikasi Lokasi Error

| Symptoms | Kemungkinan Lokasi |
|----------|-------------------|
| Halaman blank/error | Frontend React (console browser) |
| Login gagal/stuck | API `/api/auth/login.js` |
| Data tidak muncul | API atau Supabase query |
| 500 Internal Error | Serverless function error |
| 401 Unauthorized | Authentication issue |

### Step 2: Check Browser Console

```
1. Buka browser DevTools (F12)
2. Tab "Console" - lihat JavaScript errors
3. Tab "Network" - lihat API requests/responses
```

### Step 3: Debug API Endpoints

**Test API di Browser/Postman:**
```bash
# Test Users API
curl https://v1apps.vercel.app/api/users

# Test Login API
curl -X POST https://v1apps.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Step 4: Debug Supabase Queries

**Cek di Supabase Dashboard:**
1. Buka **Table Editor** - pastikan data ada
2. Buka **Logs** - lihat query errors
3. Buka **SQL Editor** - test query manual

**Test Query Manual:**
```sql
-- Cek users table
SELECT * FROM users;

-- Cek invitations
SELECT * FROM user_invitation;

-- Test password verification
SELECT verify_user_login('admin', 'admin123');

-- Cek RLS policies
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### Step 5: Common Errors & Solutions

#### Error: "Login stuck/loading forever"
```
Penyebab: RPC function tidak ada atau error
Solusi:
1. Buka Supabase SQL Editor
2. Jalankan:
   
   CREATE OR REPLACE FUNCTION verify_user_login(p_username TEXT, p_password TEXT)
   RETURNS BOOLEAN AS $$
   DECLARE
       stored_hash TEXT;
   BEGIN
       SELECT password INTO stored_hash
       FROM users WHERE username = p_username;
       
       IF stored_hash IS NULL THEN RETURN FALSE; END IF;
       RETURN stored_hash = crypt(p_password, stored_hash);
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   
   GRANT EXECUTE ON FUNCTION verify_user_login(TEXT, TEXT) TO anon, authenticated, service_role;
```

#### Error: "Username atau Password salah" (padahal benar)
```
Penyebab: User tidak ada atau password tidak ter-hash dengan benar
Solusi:
1. Cek user di database:
   SELECT username, role FROM users WHERE username = 'admin';

2. Reset password admin:
   UPDATE users 
   SET password = crypt('admin123', gen_salt('bf'))
   WHERE username = 'admin';
```

#### Error: "Data tidak muncul di dashboard"
```
Penyebab: RLS policies blocking atau query error
Solusi:
1. Cek RLS policies:
   SELECT * FROM pg_policies WHERE tablename = 'users';

2. Pastikan policy SELECT ada:
   CREATE POLICY "Allow public select on users" ON users
   FOR SELECT USING (true);
```

#### Error: "CORS Error"
```
Penyebab: Header CORS tidak di-set
Solusi: Pastikan setiap API endpoint memiliki:
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

#### Error: "Environment variable undefined"
```
Penyebab: Env var belum di-set di Vercel
Solusi:
1. Cek env vars:
   vercel env ls

2. Tambahkan yang kurang:
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_SECRET_KEY

3. Redeploy:
   vercel --prod
```

### Step 6: Vercel Logs

**Lihat logs deployment:**
```bash
vercel logs https://v1apps.vercel.app
```

**Atau di Vercel Dashboard:**
1. Buka https://vercel.com/dashboard
2. Pilih project
3. Klik "Logs" tab
4. Filter by function untuk melihat API errors

### Step 7: Local Testing

```bash
# Run locally untuk debug lebih detail
npm run dev

# Test API locally (perlu vercel dev)
vercel dev
```

---

## 📝 Checklist Troubleshooting

- [ ] Browser console tidak ada error
- [ ] Network requests return 200
- [ ] Environment variables ter-set
- [ ] Supabase tables memiliki data
- [ ] RLS policies mengizinkan operasi
- [ ] RPC functions ter-create
- [ ] Vercel deployment successful

---

## 📄 License

MIT License
