import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const proxyTarget = env.VITE_API_PROXY_TARGET;
  return {
    plugins: [react(), tailwindcss()],
    server: proxyTarget ? { proxy: { "/api": { target: proxyTarget, changeOrigin: true } } } : undefined,
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("react") || id.includes("scheduler")) return "react";
            if (id.includes("leaflet")) return "maps";
            if (id.includes("jspdf") || id.includes("html2canvas")) return "pdf";
            return undefined;
          },
        },
      },
    },
  };
});
