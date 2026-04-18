# India Tourism AI frontend

## Environment configuration

Copy `.env.example` to `.env` and set `VITE_API_URL` to the public API URL, including `/api` (for example, `https://api.example.com/api`). For a same-origin reverse proxy, use `/api`.

`VITE_API_PROXY_TARGET` is used only by the Vite development server and must not point at a production API.

## Build and deployment

Run `npm ci` followed by `npm run build`. Deploy the generated `dist/` directory. The included `_redirects` file provides the SPA fallback for hosts that support Netlify-style redirects. For other static hosts, configure all non-asset routes to return `index.html`; this is required for direct visits to React Router routes such as `/saved-trips`.
