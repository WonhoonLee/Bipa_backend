// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'          // ✅ 추가
import * as path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),                 // ✅ Vuetify 플러그인 등록
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
