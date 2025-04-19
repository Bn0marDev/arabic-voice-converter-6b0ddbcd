
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: 'es2020'
  },
  optimizeDeps: {
    exclude: ['@swc/core'],
  },
});
