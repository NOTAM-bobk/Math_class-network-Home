import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// mathclass.uk is served from the domain root, so the base stays "/".
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    host: true,
    port: 3000,
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
  },
});
