import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- 1. Import the Tailwind CSS plugin

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // <-- 2. Add the Tailwind CSS plugin to the Vite configuration
  ],
})