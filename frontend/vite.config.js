import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    proxy:{
      "/api":{
        target:"http://localhost:5000",
        changeOrigin:true,
      }//so now whenever we write /api it prefixes this line before /api automatically
    }
  },
})
