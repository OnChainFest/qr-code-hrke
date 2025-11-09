import { createClient } from '@supabase/supabase-js';

function need(name) {
  const v = process.env[name];
  if (!v) throw new Error(`ENV ${name} missing`);
  return v;
}

const SUPABASE_URL = need('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = need('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { name, email, coupon, promo } = req.body || {};
    if (!name || !email) return res.status(400).json({ ok: false, error: 'Nombre y correo son requeridos' });

    const userAgent = req.headers['user-agent'] || null;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

    const { error } = await supabase
      .from('promo_jungle_registrations')   // 👈 nombre de tabla correcto
      .insert([{ name, email, coupon, promo, user_agent: userAgent, ip }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ ok: false, error: 'DB insert failed', msg: error.message, details: error.details, hint: error.hint, code: error.code });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Handler error:', e);
    return res.status(500).json({ ok: false, error: e.message || 'Unexpected error' });
  }
}
