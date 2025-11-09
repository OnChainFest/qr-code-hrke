// pages/api/promo-register.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // sólo en servidor
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, coupon, promo } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ ok: false, error: 'Nombre y correo son requeridos' });
    }

    const userAgent = req.headers['user-agent'] || null;
    // IP best-effort (Vercel header), fallback req.socket.remoteAddress
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

    const { error } = await supabase
      .from('promo_registrations')
      .insert([{ name, email, coupon, promo, user_agent: userAgent, ip }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ ok: false, error: 'DB insert failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Unexpected error' });
  }
}
