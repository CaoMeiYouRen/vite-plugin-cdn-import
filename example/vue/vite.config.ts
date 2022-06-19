import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import importToCDN, { autoComplete } from '../../dist/index'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        open: true
    },
    plugins: [
        vue(),
        importToCDN({
            prodUrl: 'https://unpkg.com/{name}@{version}/{path}',
            modules: [
                // autoComplete('vue'),
                // autoComplete('@vueuse/core')
            ],
        }),
    ],
})
