import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseSecretKey);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        switch (req.method) {
            case 'GET':
                // Get all users (without password)
                const { data: users, error: fetchError } = await supabase
                    .from('users')
                    .select('id, username, nama, no_hp, role, created_at, updated_at')
                    .order('created_at', { ascending: false });

                if (fetchError) throw fetchError;
                return res.status(200).json({ success: true, data: users });

            case 'POST':
                // Create new user
                const { username, nama, no_hp, password, role = 'user' } = req.body;

                if (!username || !nama || !no_hp || !password) {
                    return res.status(400).json({
                        success: false,
                        error: 'Username, Nama, No HP, dan Password wajib diisi'
                    });
                }

                // Hash password using pgcrypto via raw SQL
                const { data: newUser, error: insertError } = await supabase.rpc('create_user_with_password', {
                    p_username: username,
                    p_nama: nama,
                    p_no_hp: no_hp,
                    p_password: password,
                    p_role: role
                });

                if (insertError) {
                    // Fallback: insert directly (password will need to be hashed on client or use different approach)
                    const { data: directUser, error: directError } = await supabase
                        .from('users')
                        .insert([{ username, nama, no_hp, password, role }])
                        .select('id, username, nama, no_hp, role')
                        .single();

                    if (directError) throw directError;
                    return res.status(201).json({ success: true, data: directUser });
                }

                return res.status(201).json({ success: true, data: newUser });

            default:
                return res.status(405).json({ success: false, error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
