-- =============================================
-- Supabase Database Schema
-- Landing Page Application
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable pgcrypto for password encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- Table: users
-- Stores user information with encrypted password
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: user_invitation
-- Stores user invitation information
-- =============================================
CREATE TABLE IF NOT EXISTS user_invitation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    alamat TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Indexes for better query performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_nama ON users(nama);
CREATE INDEX IF NOT EXISTS idx_users_no_hp ON users(no_hp);
CREATE INDEX IF NOT EXISTS idx_user_invitation_user_id ON user_invitation(user_id);
CREATE INDEX IF NOT EXISTS idx_user_invitation_nama ON user_invitation(nama);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_invitation table
ALTER TABLE user_invitation ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public insert on users (for registration)
CREATE POLICY "Allow public insert on users" ON users
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow public select on users
CREATE POLICY "Allow public select on users" ON users
    FOR SELECT
    USING (true);

-- Policy: Allow public update on users
CREATE POLICY "Allow public update on users" ON users
    FOR UPDATE
    USING (true);

-- Policy: Allow public insert on user_invitation
CREATE POLICY "Allow public insert on user_invitation" ON user_invitation
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow public select on user_invitation
CREATE POLICY "Allow public select on user_invitation" ON user_invitation
    FOR SELECT
    USING (true);

-- Policy: Allow public delete on user_invitation
CREATE POLICY "Allow public delete on user_invitation" ON user_invitation
    FOR DELETE
    USING (true);

-- =============================================
-- Function: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_invitation table
DROP TRIGGER IF EXISTS update_user_invitation_updated_at ON user_invitation;
CREATE TRIGGER update_user_invitation_updated_at
    BEFORE UPDATE ON user_invitation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Function: verify_password
-- Verifies user password using pgcrypto
-- =============================================
CREATE OR REPLACE FUNCTION verify_password(user_username TEXT, user_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    SELECT password INTO stored_hash
    FROM users
    WHERE username = user_username;
    
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN stored_hash = crypt(user_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated;

-- =============================================
-- Insert default admin user
-- Username: admin
-- Password: admin123
-- =============================================
INSERT INTO users (username, nama, no_hp, password, role)
VALUES ('admin', 'Administrator', '08123456789', crypt('admin123', gen_salt('bf')), 'admin')
ON CONFLICT (username) DO NOTHING;
