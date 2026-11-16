# Integración Social

Esqueleto de sitio **estático** con paleta café: solo títulos y secciones, sin contenido. Sin frameworks ni build. Listo para desplegar en **Cloudflare** con `wrangler`.

## Páginas (MVP)

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio: carrusel, menú temático, datos de las elecciones 2027 |
| `/aprende/` | Hub del Módulo 1 y 5 temas con niveles básico/intermedio/práctico: `derechos`, `poderes`, `cargos`, `leyes`, `niveles` |
| `/compara/` | Módulo 2: comparador de candidaturas CDMX (tabla, fichas, solicitudes de información) |
| `/seguimiento/` | Módulo 3: estados y reglas de seguimiento (aún sin compromisos) |
| `/metodologia/` | Principios editoriales, fuentes, calendario, historial de correcciones |
| `/contacto/`, `/legal/`, `/404.html` | Participación, aviso legal y privacidad |

## Datos del comparador

`public/assets/data/comparador.json`: `ejemplo` contiene datos **ficticios**; `real` está vacío y es donde el equipo editorial captura candidaturas, propuestas y solicitudes verificadas (campos según la investigación preliminar). Registra cada cambio en el historial de `/metodologia/`.

## Estructura

```
public/
  assets/css/styles.css      # Paleta y componentes
  assets/js/main.js          # Menú, carrusel, niveles de lectura
  assets/js/compara.js       # Comparador (lee el JSON)
  assets/data/comparador.json
  assets/img/                # Favicon e ilustraciones del carrusel
  _headers, robots.txt
templates/pagina-base.html   # Copia esto para una página nueva (no se publica)
wrangler.jsonc
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
- Al agregar una página, añádela también al menú del encabezado y al pie de cada página (el sitio no tiene build).
