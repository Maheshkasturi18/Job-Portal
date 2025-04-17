import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {
      // any request to /api ➔ http://localhost:3000/api
      "/api": {
        target:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://job-portal-5bc5.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
