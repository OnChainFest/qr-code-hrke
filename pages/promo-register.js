import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

function PromoRegister() {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | ok | error
  const [msg, setMsg] = useState('');

  // Solo usa window en cliente
  const params = useMemo(
    () => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''),
    []
  );
  const coupon = params.get('coupon') || 'BLKJUNGLE';
  const promo  = params.get('promo')  || 'JUNGLE';

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setStatus('error'); setMsg('Por favor completá nombre y correo.');
      return;
    }
    setStatus('loading'); setMsg('');

    try {
      const r = await fetch('/api/promo-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, coupon, promo })
      });
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error || 'Error');

      setStatus('ok'); setMsg('¡Gracias! Tu registro fue recibido.');
      setName(''); setEmail('');
    } catch (err) {
      setStatus('error'); setMsg('No pudimos enviar el registro. Intenta de nuevo.');
    }
  };

  return (
    <main style={{ minHeight:'100vh', display:'grid', placeItems:'center',
                   background:'linear-gradient(135deg,#00C4C7 0%,#000 100%)',
                   color:'#fff', padding:24, fontFamily:'Rubik, system-ui, Arial, sans-serif' }}>
      <div style={{ width:'100%', maxWidth:520, background:'rgba(0,0,0,.35)', borderRadius:16, padding:24 }}>
        <h1 style={{ fontSize:28, marginBottom:8 }}>HRKey – Promo JUNGLE</h1>
        <p style={{ opacity:.9, marginBottom:16 }}>Ingresá tus datos para activar la promoción.</p>

        <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
          <label style={{ display:'grid', gap:6 }}>
            <span>Nombre</span>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"
                   style={inputStyle} required />
          </label>
          <label style={{ display:'grid', gap:6 }}>
            <span>Correo</span>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com"
                   style={inputStyle} required />
          </label>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><div style={tagLabel}>Cupón</div><div style={tagValue}>{coupon}</div></div>
            <div><div style={tagLabel}>Promo</div><div style={tagValue}>{promo}</div></div>
          </div>

          <button type="submit" disabled={status==='loading'}
                  style={{ background:'#fff', color:'#00C4C7', fontWeight:700,
                           padding:'12px 16px', borderRadius:10, border:'none', cursor:'pointer' }}>
            {status==='loading' ? 'Enviando...' : 'Registrar'}
          </button>

          {status==='ok' && <div style={{ marginTop:4, background:'rgba(0,128,0,.2)', padding:10, borderRadius:8 }}>{msg}</div>}
          {status==='error' && <div style={{ marginTop:4, background:'rgba(255,0,0,.25)', padding:10, borderRadius:8 }}>{msg}</div>}
        </form>
      </div>
    </main>
  );
}

const inputStyle = { padding:'12px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,.3)',
  background:'rgba(255,255,255,.1)', color:'#fff', outline:'none' };
const tagLabel  = { fontSize:12, opacity:.8, marginBottom:4 };
const tagValue  = { padding:'8px 10px', borderRadius:8, border:'1px dashed rgba(255,255,255,.35)',
  fontFamily:'ui-monospace, Menlo, Consolas, monospace', opacity:.95 };

// 👇 Exporta la página desactivando SSR
export default dynamic(() => Promise.resolve(PromoRegister), { ssr: false });
