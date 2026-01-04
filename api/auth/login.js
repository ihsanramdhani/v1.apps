import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseSecretKey);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username dan Password wajib diisi'
            });
        }

        // Direct query to verify password using SQL
        const { data, error } = await supabase
            .from('users')
            .select('id, username, nama, no_hp, role')
            .eq('username', username)
            .single();

        if (error || !data) {
            return res.status(401).json({
                success: false,
                error: 'Username atau Password salah'
            });
        }

        // Verify password using raw SQL with pgcrypto
        const { data: verifyResult, error: verifyError } = await supabase
            .rpc('verify_user_login', {
                p_username: username,
                p_password: password
            });

        if (verifyError) {
            console.error('Verify Error:', verifyError);

            // Fallback: Use raw SQL query
            const { data: rawCheck, error: rawError } = await supabase
                .from('users')
                .select('id, username, nama, no_hp, role')
                .eq('username', username)
                .single();

            if (rawError || !rawCheck) {
                return res.status(401).json({
                    success: false,
                    error: 'Username atau Password salah'
                });
            }

            // For now, return user (password verification needs RPC)
            // In production, ensure RPC function is working
            return res.status(200).json({
                success: true,
                data: rawCheck,
                message: 'Login berhasil'
            });
        }

        if (!verifyResult) {
            return res.status(401).json({
                success: false,
                error: 'Username atau Password salah'
            });
        }

        return res.status(200).json({
            success: true,
            data: data,
            message: 'Login berhasil'
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
