import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    proxy: {
      '/api/': {
        target: 'http://192.168.64.2:3000/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api', ''),
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        index: './index.html',
        forbid: './forbid.html',
      }
    }
  }
});
