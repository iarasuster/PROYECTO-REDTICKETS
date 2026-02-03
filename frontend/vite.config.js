import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.lottie"],
  
  build: {
    // Optimizaciones de rendimiento
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
      },
    },
    
    // Chunking manual para mejor cache
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".lottie")) {
            return "assets/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
        manualChunks: {
          // Vendor chunks separados para mejor caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lottie-vendor': ['@lottiefiles/dotlottie-react'],
        },
      },
    },
    
    chunkSizeWarningLimit: 600, // Aumentar límite advertencia
  },
  
  // Optimizar dependencias en desarrollo
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});

