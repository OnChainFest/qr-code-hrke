// pages/promo-register.js
import { useEffect, useMemo, useState } from "react";
import emailjs from "emailjs-com";

export default function PromoRegister() {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error
  const [msg, setMsg] = useState("");

  // Lee params de la URL (?coupon=...&promo=...)
  const params = useMemo(() => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""), []);
  const coupon = params.get("coupon") || "BLKJUNGLE";
  const promo  = params.get("promo")  || "JUNGLE";

  // (Opcional) precargar EmailJS
  useEffect(() => {
    // emailjs-com no necesita init, pero no estorba si cambias a @emailjs/browser luego
    // emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setStatus("error");
      setMsg("Por favor completá nombre y correo.");
      return;
    }

    setStatus("loading");
    setMsg("");

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("Faltan variables de entorno de EmailJS");
      }

      // payload para el template de EmailJS
      const templateParams = {
        name,
        email,
        coupon,
        promo,
        // agrega campos extra si tu template los usa
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setStatus("ok");
      setMsg("¡Gracias! Te registraste correctamente.");
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMsg("No pudimos enviar el registro. Intenta de nuevo.");
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "linear-gradient(135deg, #00C4C7 0%, #000 100%)",
      color: "white",
      padding: 24,
      fontFamily: "Rubik, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: 520, background: "rgba(0,0,0,0.35)", borderRadius: 16, padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>HRKey – Promo JUNGLE</h1>
        <p style={{ opacity: 0.9, marginBottom: 16 }}>
          Ingresá tus datos para activar la promoción.
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Nombre</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              style={inputStyle}
              required
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Correo</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={inputStyle}
              required
            />
          </label>

          {/* Campos de solo lectura para transparencia */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={tagLabel}>Cupón</div>
              <div style={tagValue}>{coupon}</div>
            </div>
            <div>
              <div style={tagLabel}>Promo</div>
              <div style={tagValue}>{promo}</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              background: "#fff",
              color: "#00C4C7",
              fontWeight: 700,
              padding: "12px 16px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer"
            }}
          >
            {status === "loading" ? "Enviando..." : "Registrar"}
          </button>

          {status === "ok" && (
            <div style={{ marginTop: 4, background: "rgba(0,128,0,0.2)", padding: 10, borderRadius: 8 }}>
              {msg}
            </div>
          )}
          {status === "error" && (
            <div style={{ marginTop: 4, background: "rgba(255,0,0,0.25)", padding: 10, borderRadius: 8 }}>
              {msg}
            </div>
          )}
        </form>

        <div style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
          Al enviar, aceptás ser contactad@ por HRKey para esta promoción.
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  outline: "none"
};

const tagLabel = {
  fontSize: 12,
  opacity: 0.8,
  marginBottom: 4
};
const tagValue = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px dashed rgba(255,255,255,0.35)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  opacity: 0.95
};
