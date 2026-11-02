import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The local API saves to db.json. Without this, every save reloads the page.
    watch: { ignored: ['**/db.json'] },
  },
})
