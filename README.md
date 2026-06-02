# 🛒 Lista del Súper — Guía completa de instalación y uso

## Estructura de archivos

```
/
├── index.html          ← App principal (todo-en-uno)
├── manifest.json       ← Configuración PWA (íconos, nombre, color)
├── sw.js               ← Service Worker (modo offline + caché)
├── super_estado.json   ← Estado inicial para subir a Google Drive
├── icons/
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
└── README.md           ← Este archivo
```

---

## ① Publicar la app (elige una opción)

### Opción A — Netlify Drop (más rápido, 2 minutos)
1. Ve a **[netlify.com/drop](https://app.netlify.com/drop)**
2. Arrastra **toda la carpeta** del proyecto
3. Netlify te da una URL pública tipo `https://abc123.netlify.app`
4. Opcional: en "Site settings → Domain" puedes cambiarla a un nombre personalizado gratis

### Opción B — GitHub Pages (recomendado para uso permanente)
```bash
# En tu terminal
git init
git add .
git commit -m "Lista del Súper v1"
gh repo create super-lista --public --push --source=.
```
Luego en GitHub: **Settings → Pages → Branch: main → Save**
URL: `https://TU-USUARIO.github.io/super-lista`

---

## ② Instalar como app en los celulares

### Android (Chrome)
1. Abre la URL en Chrome
2. Toca el menú ⋮ → **"Agregar a pantalla de inicio"**
3. Confirma → la app aparece como ícono nativo

### iOS (Safari)
1. Abre la URL en **Safari** (no Chrome — Safari es necesario en iOS para PWA)
2. Toca el botón **Compartir** ↑ → **"Agregar a pantalla de inicio"**
3. Confirma el nombre → toca "Agregar"

> ✅ Una vez instalada, la app funciona **offline** gracias al Service Worker.

---

## ③ Configurar Google Drive para sincronizar 2 dispositivos

### Paso 1 — Crear proyecto en Google Cloud Console
1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Clic en "Seleccionar proyecto" → **"Nuevo proyecto"**
   - Nombre: `SuperLista`
3. En el menú lateral → **APIs y servicios → Biblioteca**
4. Busca **"Google Drive API"** → clic → **Habilitar**

### Paso 2 — Crear credenciales OAuth
1. **APIs y servicios → Credenciales → + Crear credenciales → ID de cliente OAuth 2.0**
2. Tipo de aplicación: **Aplicación web**
3. Nombre: `Super Lista App`
4. **Orígenes de JavaScript autorizados**: agrega tu URL del hosting (ej. `https://abc123.netlify.app`)
5. Haz clic en **Crear** → apunta el `client_id`

### Paso 3 — Subir el archivo de estado a Drive
1. Ve a [drive.google.com](https://drive.google.com)
2. Arrastra el archivo `super_estado.json` a tu Drive
3. Clic derecho en el archivo → **"Obtener vínculo"**
4. La URL tiene esta forma: `https://drive.google.com/file/d/XXXXXXXX/view`
   → El **File ID** es la cadena `XXXXXXXX` entre `/d/` y `/view`
5. ⚠️ Cambia el permiso a: **"Cualquier persona con el enlace puede editar"**
   (esto permite que ambos dispositivos lean y escriban)

### Paso 4 — Obtener Access Token (método rápido para pruebas)
1. Ve a [developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
2. Clic en el ícono ⚙️ (arriba a la derecha) → activa **"Use your own OAuth credentials"**
3. Ingresa tu `client_id` y `client_secret` → cierra
4. En el panel izquierdo busca **"Drive API v3"** → selecciona `https://www.googleapis.com/auth/drive.file`
5. Clic **"Authorize APIs"** → autoriza con tu cuenta Google
6. Clic **"Exchange authorization code for tokens"**
7. Copia el **Access token** (empieza con `ya29.`)

> ⚠️ Los tokens de OAuth Playground expiran en ~1 hora.  
> Para producción, implementa el flujo OAuth completo (ver sección avanzada abajo).

### Paso 5 — Conectar la app
1. Abre la app en tu celular → toca **⚙️** (esquina superior derecha)
2. Pega el **Access Token** y el **File ID**
3. Toca **"Guardar y conectar"**
4. El punto de sincronización se pondrá en verde ✅
5. Repite en el segundo dispositivo con el **mismo File ID y el mismo token**

---

## ④ Cómo funciona la sincronización

```
Dispositivo A marca un checkbox o edita cantidad/precio
  └─ Guarda en localStorage inmediatamente (sin lag)
  └─ Espera 1.5 segundos (debounce)
  └─ Sube JSON a Google Drive con versión = timestamp

Dispositivo B (cada 30 segundos)
  └─ Lee el JSON de Drive
  └─ Compara version del archivo vs. version local
  └─ Si Drive es más nuevo → actualiza estado + UI
  └─ Si es igual → no hace nada (sin parpadeos)
```

**Manejo de conflictos**: gana el último en escribir (last-write-wins).  
Si ambos dispositivos cambian algo simultáneamente, el primer "write" gana  
y el segundo lo sobrescribe en el siguiente ciclo de 30 segundos.

**Modo offline**: todos los cambios se guardan en `localStorage`.  
Al recuperar conexión, el próximo ciclo sube el estado actualizado.

---

## ⑤ Modo edición de piezas y precios

1. Toca el ícono **✏️** en la cabecera
2. Aparece el banner verde "Modo edición"
3. En cada artículo:
   - **Botones − / +** → cambian la cantidad de piezas (mínimo 1)
   - **Campo de precio** → edita directamente el precio unitario en pesos
4. Los cambios se guardan automáticamente y se sincronizan con Drive
5. Los subtotales y el total se actualizan en tiempo real
6. Toca **"Listo ✓"** para salir del modo edición

> Los valores editados se guardan como "overrides" sobre los datos base del Excel.  
> Si quieres resetear un precio/cantidad al valor original, recarga la página y borra el localStorage.

---

## ⑥ Descripción de cada archivo

| Archivo | Función |
|---------|---------|
| `index.html` | App completa: UI + lógica + datos + sincronización |
| `manifest.json` | Le dice al navegador que es una PWA instalable |
| `sw.js` | Service Worker: caché offline + background sync |
| `super_estado.json` | Archivo inicial que se sube a Drive (estado vacío) |
| `icons/*.png` | Íconos en 8 tamaños para Android, iOS, y escritorio |

---

## ⑦ Estructura del JSON en Drive

```json
{
  "version": 1718920345123,
  "checks": {
    "walmart": { "0": true, "5": true, "23": false },
    "sams":    { "1": true },
    "heb":     {},
    "frutas":  { "0": true, "3": true }
  },
  "overrides": {
    "walmart_1": { "q": 3 },
    "walmart_5": { "q": 2, "p": 95 },
    "heb_2":     { "p": 40 }
  }
}
```

- **`version`**: timestamp Unix en ms — determina quién tiene el estado más reciente
- **`checks`**: `{ índice: true/false }` — qué artículos están marcados
- **`overrides`**: `{ storeId_índice: { q, p } }` — cantidades/precios editados

---

## ⑧ Solución de problemas comunes

| Problema | Solución |
|----------|----------|
| "Error de sincronización" en rojo | El Access Token expiró — genera uno nuevo en OAuth Playground |
| Los cambios no llegan al otro dispositivo | Verifica que ambos usen el mismo File ID y que el archivo Drive sea público (edición) |
| La app no se instala en iOS | Asegúrate de usar **Safari**, no Chrome ni otro navegador |
| Los íconos no aparecen | Sube también la carpeta `icons/` — Netlify la incluye automáticamente al arrastrar la carpeta |
| El Service Worker no se registra | Asegúrate de servir desde HTTPS (Netlify/GitHub Pages lo hacen automáticamente) |

---

## ⑨ Configuración OAuth de producción (opcional, para tokens permanentes)

Para no tener que regenerar el token cada hora, agrega este script a tu `index.html`  
e inicializa con tu `client_id`:

```javascript
// En el <head> de index.html
const CLIENT_ID = 'TU_CLIENT_ID.apps.googleusercontent.com';
const SCOPES    = 'https://www.googleapis.com/auth/drive.file';

function initOAuth() {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(location.origin)}` +
    `&response_type=token` +
    `&scope=${encodeURIComponent(SCOPES)}`;
  window.open(url, '_blank', 'width=500,height=600');
}

// Capturar el token del fragment después del redirect
if (location.hash.includes('access_token')) {
  const params = new URLSearchParams(location.hash.slice(1));
  const token  = params.get('access_token');
  if (token) {
    state.driveToken = token;
    save();
    // Limpiar URL
    history.replaceState(null, '', location.pathname);
  }
}
```

Reemplaza el botón de "Guardar y conectar" del panel Drive por un botón  
que llame a `initOAuth()` para hacer el flujo automático.

---

*Generado para Roberto · Querétaro, México · Lista del Súper v1.0*
