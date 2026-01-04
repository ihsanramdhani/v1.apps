-- =============================================
-- Function: verify_password
-- Verifies user password using pgcrypto
-- Run this after the main schema
-- =============================================

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create verify_password function
CREATE OR REPLACE FUNCTION verify_password(user_no_hp TEXT, user_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    -- Get the stored password hash
    SELECT password INTO stored_hash
    FROM users
    WHERE no_hp = user_no_hp;
    
    -- If user not found, return false
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Compare password with stored hash
    RETURN stored_hash = crypt(user_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated;
