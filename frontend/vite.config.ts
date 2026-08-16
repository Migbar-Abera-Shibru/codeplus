import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['sb-6ntg6i7u3p0h.h.vercel.run', 'sb-6ntg6i7u3p0h.vercel.run'],
  },
})
