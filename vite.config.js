import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Aumentamos el límite de la advertencia para que Vercel no se asuste
    chunkSizeWarningLimit: 5000, 
    
    // 2. Le enseñamos a empaquetar las librerías pesadas por separado
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Mandamos todo lo de Firebase a un archivo aparte
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            // Mandamos todo el motor de FreeSewing a otro archivo
            if (id.includes('@freesewing')) {
              return 'freesewing-vendor';
            }
            // El resto de las librerías
            return 'vendor';
          }
        }
      }
    }
  }
})
