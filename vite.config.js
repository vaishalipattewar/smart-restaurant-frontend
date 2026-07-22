import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Define process.env.REACT_APP_API_BASE at build time so browser code can use it
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_API_BASE': JSON.stringify(process.env.REACT_APP_API_BASE || 'http://localhost:5000/api')
    }
  }
})
