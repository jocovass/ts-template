import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // React dev needs these, unsafe should be removed in prod
        "style-src 'self' 'unsafe-inline'", // CSS-in-JS needs unsafe-inline
        "connect-src 'self' ws: wss: http://localhost:8000", // WebSocket for HMR
        "img-src 'self' data:", // blob: Has its usecase like canvas exports, dynamically generated images but
        // can be used for script injection(creating executable code via blobs).
        "font-src 'self' data:",
        "object-src 'none'", // Block plugins/flash
        /**
         * Prevent base tag hijacking
         * Example.
         * <head>
         *  // site tries to load JS using relative path
         *  <script src="/js/app.js"></script>
         * </head>
         *
         *
         * // Malicious user injects base tag via XSS, after which the site will load the scripts
         * // from the malicious site
         * <base href="https://malicious-site.com/">
         */
        "base-uri 'self'",
        "form-action 'self'", // Only submit forms to same origin
        "frame-ancestors 'none'", // Prevent embedding in iframes
        "upgrade-insecure-requests", // Force HTTPS in prod
      ].join("; "),
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  },
});
