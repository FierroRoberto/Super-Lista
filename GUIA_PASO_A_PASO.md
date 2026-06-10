# 🛒 Lista del Súper — Guía completa de instalación

---

## PARTE 1 — Subir la app a GitHub Pages

### Paso 1.1 — Crear cuenta en GitHub (si no tienes)
- Ve a https://github.com → Sign up → crea cuenta gratis

### Paso 1.2 — Crear el repositorio
- Clic en el **+** (arriba a la derecha) → **New repository**
- Nombre: `super-lista`
- Visibilidad: **Public**
- Clic en **Create repository**

### Paso 1.3 — Subir los archivos
- En tu nuevo repo, clic en **"uploading an existing file"**
- Arrastra **todos** estos archivos:
  - `index.html`
  - `manifest.json`
  - `sw.js`
  - `super_estado.json`
  - `_config.yml`
  - `.nojekyll`
  - `clear-cache.html`
  - Carpeta `icons/` completa (todos los PNG)
  - Carpeta `.github/` completa (con `workflows/deploy.yml`)
- Clic en **Commit changes**

### Paso 1.4 — Activar GitHub Pages
- En tu repo → **Settings** → menú izquierdo **Pages**
- En **Source** selecciona **GitHub Actions** → **Save**
- Espera ~2 minutos → tu URL será:
  `https://fierroroberto.github.io/super-lista/`

### Paso 1.5 — Verificar
- Abre esa URL en el navegador de tu celular
- Debe aparecer la app con las 4 tiendas

---

## PARTE 2 — Configurar Google Cloud Console

### Paso 2.1 — Crear proyecto
- Ve a https://console.cloud.google.com
- Selector de proyectos (arriba) → **Nuevo proyecto**
- Nombre: `SuperLista` → **Crear**

### Paso 2.2 — Habilitar Google Drive API
- Menú izquierdo → **APIs y servicios** → **Biblioteca**
- Busca: `Google Drive API` → **Habilitar**

### Paso 2.3 — Configurar pantalla de consentimiento
- **APIs y servicios** → **Pantalla de consentimiento de OAuth**
- Tipo: **Externo** → **Crear**
- Nombre de la app: `Lista del Súper`
- Correo de asistencia: tu correo
- Correo del desarrollador: tu correo
- **Guardar y continuar** (3 veces hasta el resumen)
- En el resumen → sección **"Usuarios de prueba"** → **+ Add users**
- Agrega los correos de **ambos celulares**
- **Guardar**

### Paso 2.4 — Crear credenciales OAuth
- **APIs y servicios** → **Credenciales**
- **+ Crear credenciales** → **ID de cliente OAuth 2.0**
- Tipo: **Aplicación web**
- Nombre: `Super Lista App`
- **"Orígenes de JavaScript autorizados"** → **+ Agregar URI**:
  `https://fierroroberto.github.io`
- **Crear**
- Copia tu **Client ID** (termina en `.apps.googleusercontent.com`)

---

## PARTE 3 — Preparar archivo en Google Drive

### Paso 3.1 — Subir el archivo de estado
- Ve a https://drive.google.com
- Arrastra el archivo `super_estado.json` a Drive

### Paso 3.2 — Obtener el File ID
- Clic derecho en `super_estado.json` → **Compartir**
- Cambia acceso a **"Cualquier persona con el enlace"** → **Editor**
- **Copiar enlace** — la URL se ve así:
  `https://drive.google.com/file/d/1BxiMVs0XRA5.../view`
- El **File ID** es la parte entre `/d/` y `/view`
- Guarda ese ID — lo usarás en ambos celulares

---

## PARTE 4 — Instalar la app en los celulares

### Paso 4.1 — Limpiar caché (obligatorio si ya abriste la app antes)
- Abre: `https://fierroroberto.github.io/super-lista/clear-cache.html`
- Toca **"Borrar caché y actualizar"**

### Paso 4.2 — Instalar en Android
- Chrome → `https://fierroroberto.github.io/super-lista/`
- Menú ⋮ → **"Instalar app"** → Confirma ✅

### Paso 4.3 — Instalar en iOS
- **Safari** (obligatorio) → misma URL
- Botón Compartir ↑ → **"Agregar a pantalla de inicio"** → Confirma ✅

---

## PARTE 5 — Conectar con Google Drive (en CADA celular)

### Paso 5.1 — Abrir configuración
- Abre la app → toca **⚙️** (esquina superior derecha)

### Paso 5.2 — Llenar los datos
| Campo      | Qué pegar                                          |
|------------|----------------------------------------------------|
| Client ID  | El del Paso 2.4                                    |
| File ID    | El del Paso 3.2                                    |

### Paso 5.3 — Autorizar
- Toca **"🔑 Guardar y conectar con Google"**
- Elige la cuenta que tiene el `super_estado.json` en Drive
- Acepta los permisos → punto sync **verde** ✅

### Paso 5.4 — Repetir en el segundo celular
- Mismos pasos 5.1–5.3 con el **mismo File ID**

---

## PARTE 6 — Verificar sincronización

1. En **Dispositivo 1**: marca un artículo
2. Espera **10 segundos**
3. En **Dispositivo 2**: toca **↻ Sync**
4. El artículo debe aparecer marcado + toast **"🔄 Lista actualizada"**

---

## Uso diario

| Acción                  | Cómo                                      |
|-------------------------|-------------------------------------------|
| Marcar comprado         | Toca la fila                              |
| Resetear tienda         | Botón **↺ Reset**                         |
| Editar piezas/precio    | **✏️** → usar − / + y campo de precio     |
| Mover artículo          | **✏️** → botones ▲ ▼                      |
| Eliminar artículo       | **✏️** → botón 🗑                          |
| Agregar artículo        | Botón **＋** (parte inferior)             |
| Sync manual             | Toca **↻ Sync**                           |
| Renovar sesión          | **⚙️** → "↻ Reconectar con Google"       |
| Total general           | Siempre visible arriba de las pestañas    |

---

## Solución de problemas

| Problema                             | Solución                                                      |
|--------------------------------------|---------------------------------------------------------------|
| "acceso bloqueado" al autorizar      | Google Cloud → Usuarios de prueba → agrega tu correo          |
| Punto sync rojo                      | ⚙️ → Reconectar con Google                                    |
| Cambios no llegan al otro celular    | Verifica mismo File ID y punto sync verde en ambos            |
| App muestra versión vieja            | `clear-cache.html` → "Borrar caché y actualizar"              |
| No aparece "Instalar" en iOS         | Usa Safari, no Chrome                                         |
| Token expirado                       | ⚙️ → "Reconectar con Google" → elige tu cuenta               |

---

*Lista del Súper v1.0 — fierroroberto.github.io/super-lista*
