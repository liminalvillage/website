import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        quests: resolve(__dirname, 'quests.html'),
        services: resolve(__dirname, 'services.html'),
        lunations: resolve(__dirname, 'lunations.html'),
      },
    },
  },
})
