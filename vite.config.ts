import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
  // The 'define' block for environment variables is no longer needed.
  // Vite automatically handles environment variables prefixed with "VITE_".
})
