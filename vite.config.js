import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/www-vue-countries/dist/',
  plugins: [vue()],
})
