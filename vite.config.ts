import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    // O banco de questões inteiro vai no bundle de propósito: o app precisa
    // funcionar offline e o conteúdo é o produto. São ~250 kB comprimidos,
    // baixados uma vez na instalação da PWA.
    chunkSizeWarningLimit: 1400,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Baliza — prova teórica',
        short_name: 'Baliza',
        description: 'Treino diário para a prova teórica de habilitação.',
        lang: 'pt-BR',
        theme_color: '#16181d',
        background_color: '#fbfaf8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icone-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // As 146 placas entram no precache: ~1,2 MB, e o app precisa
        // funcionar offline por completo.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
})
