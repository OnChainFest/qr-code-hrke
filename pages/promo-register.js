// pages/api/promo-register.js
import { createClient } from '@supabase/supabase-js';

function need(name) {
  const v = process.env[name];
  if (!v) throw new Error(`ENV ${name} missing`);
  return v;
}

const supabase = createClient(need('SUPABASE_URL'), need('SUPABASE_SERVICE_ROLE_KEY'));

async function sendEmailJS({ name, email, coupon, promo }) {
  // Usa variables privadas; si no están, cae a las públicas
  const service_id =
    process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const template_id =
    process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const user_id =
    process.env.EMAILJS_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_EMAILJS_USER_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!service_id || !template_id || !user_id) {
    console.warn('[emailjs] faltan env (service_id/template_id/user_id), se omite envío');
    return;
  }

  const payload = {
    service_id,
    template_id,
    user_id, // public/user key
    template_params: {
      // ⚠️ los nombres deben existir en tu template de EmailJS
      name,
      email,
      coupon,
      promo
    }
  };

  const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`EmailJS error ${r.status}: ${txt}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { name, email, coupon, promo } = req.body || {};
    if (!name || !email)
      return res.status(400).json({ ok: false, error: 'Nombre y correo son requeridos' });

    // 1) Guardar en Supabase
    const { error } = await supabase
      .from('promo_jungle_registrations')
      .insert([{ name, email, coupon, promo }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ ok: false, error: 'DB insert failed' });
    }

    // 2) Enviar email (si falla, no rompemos el registro)
    try {
      await sendEmailJS({ name, email, coupon, promo });
    } catch (mailErr) {
      console.error('[emailjs] envío falló:', mailErr);
      // no hacemos return 500 a propósito; el usuario ya quedó registrado
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Handler error:', e);
    return res.status(500).json({ ok: false, error: e.message || 'Unexpected error' });
  }
}
