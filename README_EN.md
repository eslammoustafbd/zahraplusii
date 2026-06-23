# Zahrat El-Rabea For Food Manufacturing

Final production build of the multilingual website and CMS. The protected administration route is `/eslammm`, powered by a zero-runtime-dependency Node.js server.

## Release highlights

- Formal Noto Kufi Arabic and Manrope typography with resilient system fallbacks.
- Dashboard-managed image/video landing slides with posters, ordering and visibility controls.
- Editable identity, logo, contact/footer/map data, products, categories, certifications, achievements, news, FAQ and SEO.
- Arabic, English, Spanish and Italian content.
- Responsive layouts, stable media geometry, keyboard focus states and reduced-motion/data-saver support.
- Brotli/Gzip compression, ETag, video/PDF range requests, security headers and dynamic Sitemap/Robots.
- Generic Node.js, Docker, PM2, Procfile, Nginx and Apache reverse-proxy deployment adapters.
- The public frontend has a static content fallback; dashboard and form persistence require the application server.

Environment variables: `HOST`, `PORT`, and `SITE_URL`. See `.env.example`.

Run `npm run check` to validate scripts, content, icons, assets and key routes before deployment.
