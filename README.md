# Integración Social

Esqueleto de sitio **estático** con paleta café: solo títulos y secciones, sin contenido. Sin frameworks ni build. Listo para desplegar en **Cloudflare** con `wrangler`.

## Páginas

| Ruta | Estructura |
| --- | --- |
| `/` | Título principal + Secciones 1 a 3 |
| `/listado/` | Filtros + Resultados |
| `/detalle/` | Secciones 1 a 4 + panel lateral |
| `/formulario/` | Secciones 1 y 2 |
| `/consulta/` | Búsqueda + Resultado |
| `/contacto/` | Secciones 1 y 2 |
| `/legal/` | Secciones 1 a 3 |
| `/404.html` | Página no encontrada |

## Estructura

```
public/                 # Lo que se publica
  assets/css/styles.css # Paleta en variables :root (--brown-*, --accent*)
  assets/js/main.js     # Menú móvil
  _headers, robots.txt  # Cabeceras de seguridad y bloqueo de indexación
templates/
  pagina-base.html      # Copia esto para crear una página nueva (no se publica)
wrangler.jsonc          # Config de Cloudflare (assets estáticos)
```

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:8787
```

## Despliegue en Cloudflare

```bash
npx wrangler login
npm run deploy   # = npx wrangler deploy
```

Desde el panel (Workers Builds): build command vacío, deploy command `npx wrangler deploy`. El nombre del Worker en `wrangler.jsonc` (`integracion-social`) debe coincidir con el del proyecto.

## Notas

- La CSP de `_headers` no permite scripts ni estilos en línea; usa archivos en `assets/`.
- `robots.txt`, la etiqueta `noindex` y `X-Robots-Tag` bloquean la indexación; quítalos al publicar.
- Al agregar una página, añádela también al menú del encabezado.
