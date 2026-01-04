-- =============================================
-- Migration: Add password column to users table
-- Run this if you already have the users table
-- =============================================

-- Enable pgcrypto for password encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Add password column if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Add role column if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Update existing users without password (set default password: password123)
UPDATE users 
SET password = crypt('password123', gen_salt('bf'))
WHERE password IS NULL;

-- Make password NOT NULL after setting defaults
ALTER TABLE users ALTER COLUMN password SET NOT NULL;

-- Add update policy if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Allow public update on users'
    ) THEN
        CREATE POLICY "Allow public update on users" ON users
            FOR UPDATE
            USING (true);
    END IF;
END
$$;

-- Add delete policy for invitations if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_invitation' AND policyname = 'Allow public delete on user_invitation'
    ) THEN
        CREATE POLICY "Allow public delete on user_invitation" ON user_invitation
            FOR DELETE
            USING (true);
    END IF;
END
$$;

-- Insert admin user if not exists
INSERT INTO users (nama, no_hp, password, role)
SELECT 'Admin', '08123456789', crypt('admin123', gen_salt('bf')), 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin');
