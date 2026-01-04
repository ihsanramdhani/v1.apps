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
                // Get all invitations, optionally filter by user_id
                const { user_id } = req.query;

                let query = supabase
                    .from('user_invitation')
                    .select('*, users(nama, no_hp)')
                    .order('created_at', { ascending: false });

                if (user_id) {
                    query = query.eq('user_id', user_id);
                }

                const { data: invitations, error: fetchError } = await query;

                if (fetchError) throw fetchError;
                return res.status(200).json({ success: true, data: invitations });

            case 'POST':
                // Create new invitation
                const { user_id: invUserId, nama, no_hp, alamat } = req.body;

                if (!invUserId || !nama || !no_hp || !alamat) {
                    return res.status(400).json({
                        success: false,
                        error: 'Semua field wajib diisi (user_id, nama, no_hp, alamat)'
                    });
                }

                const { data: newInvitation, error: insertError } = await supabase
                    .from('user_invitation')
                    .insert([{ user_id: invUserId, nama, no_hp, alamat }])
                    .select('*, users(nama, no_hp)')
                    .single();

                if (insertError) throw insertError;
                return res.status(201).json({ success: true, data: newInvitation });

            default:
                return res.status(405).json({ success: false, error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
