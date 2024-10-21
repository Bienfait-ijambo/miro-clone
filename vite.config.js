import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';  

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
        }),
        vue(),
    ],

    resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))  // Correctly resolve file paths
        }
    },

    server: {
        proxy: {
          // Proxy Web Worker requests to your backend at port 8000
          '/worker': {
            target: 'http://127.0.0.1:8000',  // Your Laravel backend
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/worker/, '/js')  // Rewrite if needed
          }
        }
    }
});
