# 🛒 Lista del Súper

App PWA para lista de compras sincronizada entre dispositivos en tiempo real via Google Drive.

---

## Estructura de archivos

```
/
├── index.html                    ← App completa
├── manifest.json                 ← PWA manifest
├── sw.js                         ← Service Worker (offline)
├── super_estado.json             ← Sube este archivo a Google Drive
├── _config.yml                   ← Config GitHub Pages
├── .nojekyll                     ← Desactiva Jekyll
├── icons/
│   ├── icon-72.png … icon-512.png
│   └── screenshot-mobile.png
└── .github/workflows/deploy.yml ← Deploy automático
```

---

## Configuración en 3 pasos

### Paso 1 — Subir a GitHub Pages

1. Crea repo público en github.com → sube todos los archivos
2. Settings → Pages → Source: **GitHub Actions** → Save
3. Tu URL: `https://TU-USUARIO.github.io/super-lista/`

### Paso 2 — Google Cloud Console (5 min, gratis)

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crea proyecto → nombre: `SuperLista`
3. APIs y servicios → Biblioteca → **Google Drive API** → Habilitar
4. Pantalla de consentimiento OAuth:
   - Tipo: **Externo**
   - Agrega tu correo como **usuario de prueba**
5. Credenciales → **+ Crear → ID de cliente OAuth 2.0**
   - Tipo: **Aplicación web**
   - Orígenes JS autorizados: `https://TU-USUARIO.github.io`
   - URIs de redireccionamiento: *(dejar vacío — GIS no lo necesita)*
6. Copia el **Client ID** (termina en `.apps.googleusercontent.com`)

### Paso 3 — Conectar la app

1. Sube `super_estado.json` a Google Drive
2. Clic derecho → compartir → **"Cualquier persona con el enlace puede editar"**
3. Copia el **File ID** de la URL: `.../file/d/ESTE_ID/view`
4. Abre la app → toca **⚙️**
5. Pega el **Client ID** y el **File ID**
6. Toca **"Guardar y conectar con Google"** → autoriza una sola vez
7. Punto verde ✅ — sync activo

**Repite el paso 3 en el segundo dispositivo con el mismo File ID.**

---

## Cómo funciona la sincronización

- El estado (checks, cantidades, precios, artículos nuevos) se guarda como JSON en Drive
- Polling automático cada **10 segundos**
- Sync inmediato al volver a la app (visibilitychange)
- El token OAuth se renueva automáticamente usando **Google Identity Services**
- Funciona offline — los cambios se suben al reconectar

---

## Uso diario

| Acción | Cómo |
|--------|------|
| Marcar artículo | Toca la fila |
| Resetear tienda | Botón **↺ Reset** |
| Editar piezas/precio | ✏️ → steppers y campos de precio |
| Agregar artículo | Botón **＋** en la parte inferior |
| Forzar sync manual | Toca **↻ Sync** en la barra |
| Diagnosticar error | Toca la barra de sync cuando está en rojo |
| Renovar sesión | ⚙️ → "Renovar sesión de Google" |

---

## Instalar como app (PWA)

**Android:** Chrome → menú ⋮ → "Instalar app"  
**iOS:** Safari → Compartir ↑ → "Agregar a pantalla de inicio"
