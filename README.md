# HRKey - Promo JUNGLE

Proyecto independiente para el QR impreso de la promoción JUNGLE.

## 🚀 Setup Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un nuevo proyecto en Supabase (o usa uno existente)
2. Ve al SQL Editor y ejecuta el contenido de `supabase-setup.sql`
3. Copia las credenciales:
   - Ve a Settings > API
   - Copia el `Project URL`
   - Copia el `anon/public` key

### 3. Configurar EmailJS

1. Ve a [EmailJS](https://www.emailjs.com/)
2. Crea un nuevo servicio (Gmail, Outlook, etc.)
3. Crea un nuevo template:
   - Nombre: `hrkey_jungle_welcome`
   - Copia el contenido de `emailjs-template.html`
   - Variables a usar: `{{to_name}}`, `{{to_email}}`
4. Copia tus credenciales:
   - Service ID
   - Template ID
   - User ID (Public Key)

### 4. Variables de entorno

Crea un archivo `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=tu_user_id
```

### 5. Probar localmente

```bash
npm run dev
```

Abre: `http://localhost:3000/promo-register.html?coupon=BLKJUNGLE&promo=JUNGLE`

## 📦 Deploy en Vercel

### Opción 1: Deploy desde GitHub

1. Sube el proyecto a un repo de GitHub
2. Conecta Vercel a tu cuenta de GitHub
3. Importa el repositorio
4. Agrega las variables de entorno en Vercel:
   - Ve a Settings > Environment Variables
   - Agrega todas las variables del `.env.local`
5. Deploy

### Opción 2: Deploy con Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Sigue las instrucciones y agrega las variables de entorno cuando te lo pida.

### Configuración en Vercel

1. **Framework Preset**: Next.js
2. **Build Command**: `npm run build`
3. **Output Directory**: `out`
4. **Install Command**: `npm install`

### Variables de entorno en Vercel

En el dashboard de Vercel, ve a:
- Settings > Environment Variables
- Agrega todas las variables con el prefijo `NEXT_PUBLIC_`

## 🔗 URL del QR

Una vez deployado, tu URL será:
```
https://tu-dominio.vercel.app/promo-register.html?coupon=BLKJUNGLE&promo=JUNGLE
```

Para usar `hrkey.xyz`:
1. Ve a Settings > Domains en Vercel
2. Agrega tu dominio custom
3. Actualiza los DNS según las instrucciones

## 📊 Estructura del Proyecto

```
hrkey-promo-jungle/
├── pages/
│   ├── _app.js              # Configuración global
│   └── promo-register.js    # Landing page principal
├── styles/
│   └── globals.css          # Estilos globales
├── public/                  # Assets estáticos
├── supabase-setup.sql       # Script para crear tabla
├── emailjs-template.html    # Template del email
├── .env.example             # Ejemplo de variables
├── next.config.js           # Configuración de Next.js
└── package.json             # Dependencias

```

## 🗄️ Estructura de la Base de Datos

Tabla: `promo_jungle_registrations`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único (auto) |
| email | TEXT | Email (único) |
| name | TEXT | Nombre completo |
| coupon | TEXT | Código cupón |
| promo | TEXT | Nombre promo |
| registered_at | TIMESTAMPTZ | Fecha registro |
| email_sent | BOOLEAN | Email enviado |

## 📧 Email Template

El template de EmailJS debe incluir:

**Variables:**
- `{{to_name}}` - Nombre del usuario
- `{{to_email}}` - Email del usuario

**Asunto sugerido:**
```
🎉 ¡Bienvenido a HRKey! Tu trayectoria profesional, verificada y en tu control
```

## 🎨 Colores de HRKey

- Primary (Teal): `#00C4C7`
- Light Teal: `#4DE7E8`
- Dark Graphite: `#0E1E22`
- Medium Graphite: `#1a2f35`

## 🔍 Testing

Para probar el flujo completo:

1. Abre la URL con los parámetros del QR
2. Llena el formulario con datos de prueba
3. Verifica que:
   - Se guarde en Supabase
   - Llegue el email
   - Se muestre el mensaje de éxito

## 🛠️ Troubleshooting

### Error: "This email is already registered"
- El email ya existe en la base de datos
- Usa otro email o elimina el registro existente

### No llega el email
- Verifica las credenciales de EmailJS
- Revisa la bandeja de spam
- Verifica el template en EmailJS

### Error de conexión a Supabase
- Verifica las variables de entorno
- Asegúrate de que las políticas RLS estén activas
- Revisa que la tabla exista

## 📝 Mantenimiento

Para ver los registros:
1. Ve a Supabase > Table Editor
2. Selecciona `promo_jungle_registrations`
3. Exporta a CSV si necesitas

Para enviar el link de acceso después:
- Filtra por `email_sent = true` para ver usuarios confirmados
- Usa los emails para enviar invitaciones manualmente
- O crea un script automatizado

## 🔐 Seguridad

- ✅ Row Level Security (RLS) habilitado
- ✅ Solo inserciones públicas permitidas
- ✅ Validación de email único
- ✅ Variables de entorno seguras
- ✅ No se exponen keys privadas

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica la consola del navegador
3. Revisa los logs de Supabase

---

**Verified > Hyped** 🚀
