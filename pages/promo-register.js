export default function PromoRegister() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'linear-gradient(135deg, #00C4C7 0%, #000 100%)',
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Rubik, sans-serif',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>HRKey – Promo JUNGLE</h1>
        <p style={{ marginBottom: '1rem' }}>Accedé al registro exclusivo para Blockchain Jungle</p>
        <a href="https://hrkey.xyz" 
           style={{
             display: 'inline-block',
             background: '#fff',
             color: '#00C4C7',
             padding: '10px 20px',
             borderRadius: '8px',
             textDecoration: 'none',
             fontWeight: '600'
           }}>
          Ir al sitio oficial
        </a>
      </div>
    </main>
  );
}
