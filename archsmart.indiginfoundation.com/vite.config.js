import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // optional: import like "@/components/Header.jsx"
    },
  },
  optimizeDeps: {
    include: [
      // Ensure Vite pre-bundles editor deps when dev server starts
      "react-quill-new",
    ],
  },
  server: {
    port: 5173,        // change port if needed
    open: true,        // auto opens browser
  },
  build: {
    outDir: "dist",
  },
});
