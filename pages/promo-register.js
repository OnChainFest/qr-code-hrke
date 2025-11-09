// pages/api/promo-register.js
import { createClient } from '@supabase/supabase-js';

function need(name) {
  const v = process.env[name];
  if (!v) throw new Error(`ENV ${name} missing`);
  return v;
}

const supabase = createClient(need('SUPABASE_URL'), need('SUPABASE_SERVICE_ROLE_KEY'));

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { name, email, coupon, promo } = req.body || {};
    if (!name || !email) return res.status(400).json({ ok: false, error: 'Nombre y correo son requeridos' });

    // 👇 Inserta solo las columnas que sabes que existen en tu tabla
    const { error } = await supabase
      .from('promo_jungle_registrations')
      .insert([{ name, email, coupon, promo }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        ok: false, error: 'DB insert failed',
        msg: error.message, details: error.details, hint: error.hint, code: error.code
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Handler error:', e);
    return res.status(500).json({ ok: false, error: e.message || 'Unexpected error' });
  }
}
