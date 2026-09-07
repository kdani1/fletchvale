import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function apkDownload(): Plugin {
  return {
    name: 'apk-download',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0]?.endsWith('.apk')) {
          res.setHeader('Content-Type', 'application/vnd.android.package-archive')
          res.setHeader('Content-Disposition', 'attachment; filename="Nyilvolgy.apk"')
        }
        next()
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), apkDownload()],
  server: {
    host: true,
    port: 45447,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 45447,
    strictPort: true,
  },
})
