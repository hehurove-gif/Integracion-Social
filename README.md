# Integración Social (MVP no oficial)

Plantilla de sitio **estático** para una plataforma administrativa de trámites y apoyos sociales. Paleta café, sin frameworks ni build, lista para desplegar en **Cloudflare** con `wrangler`.

> Es un prototipo con fines de demostración. No es un sitio oficial ni representa a ninguna dependencia. Todo el contenido (trámites, folios, avisos) es de ejemplo.

## Páginas

| Ruta | Descripción |
| --- | --- |
| `/` | Inicio: hero, accesos rápidos, pasos y avisos |
| `/tramites/` | Listado con búsqueda y filtro por categoría |
| `/tramites/<slug>/` | Detalle de trámite (requisitos, pasos, datos clave) |
| `/programas/` | Programas y apoyos |
| `/seguimiento/` | Consulta de folio (demo: `IS-2026-0001`, `0002`, `0003`) |
| `/faq/` | Preguntas frecuentes |
| `/contacto/` | Formulario de contacto (demo, no envía datos) |
| `/aviso-de-privacidad/` | Plantilla de aviso de privacidad |
| `/404.html` | Página de error |

## Estructura

```
public/                 # Lo que se publica
  index.html, tramites/, programas/, seguimiento/, faq/, contacto/, ...
  assets/css/styles.css # Variables de la paleta en :root
  assets/js/            # main.js, tramites.js, seguimiento.js
  _headers              # Cabeceras de seguridad (CSP sin inline)
  robots.txt            # Bloquea indexación (MVP)
templates/
  pagina-base.html      # Copia esto para crear una página nueva (no se publica)
wrangler.jsonc          # Config de Cloudflare (assets estáticos)
```

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:8787
```

## Despliegue en Cloudflare (wrangler)

Desde la terminal:

```bash
npx wrangler login
npm run deploy   # = npx wrangler deploy
```

Desde el panel de Cloudflare (Workers Builds, conectando este repo):

- **Build command:** vacío
- **Deploy command:** `npx wrangler deploy`
- **Root directory:** `/`

`wrangler.jsonc` ya apunta a `./public` y usa `404.html` como página de error. El nombre del Worker (`integracion-social`) debe coincidir con el del proyecto en Cloudflare.

## Cómo personalizar

- **Colores:** edita las variables `--brown-*` y `--accent*` al inicio de `public/assets/css/styles.css`.
- **Nueva página:** copia `templates/pagina-base.html` a `public/<ruta>/index.html`, ajusta título y contenido, y agrégala al menú en el encabezado de cada página.
- **Nuevo trámite:** duplica la carpeta de un trámite en `public/tramites/`, edita su contenido y agrega su tarjeta en `public/tramites/index.html` (con los atributos `data-*` que usa el filtro).
- **Seguimiento real:** en `assets/js/seguimiento.js`, sustituye `buscarFolio` por una llamada a tu API.
- **Indexación:** al pasar a producción, elimina `Disallow: /` de `robots.txt`, el `<meta name="robots">` de las páginas y la línea `X-Robots-Tag` de `_headers`.

## Notas

- La política CSP exige que no haya scripts ni estilos en línea; usa archivos en `assets/`.
- Antes de publicar de forma oficial, reemplaza el aviso de privacidad, los datos de contacto y la leyenda de MVP.
