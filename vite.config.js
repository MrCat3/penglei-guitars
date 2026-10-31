import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 43123,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 43123,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        instruments: resolve('instruments.html'),
        available: resolve('available.html'),
        about: resolve('about.html'),
        inquire: resolve('inquire.html'),
      },
    },
  },
})
