import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    define: {
        'process.env.APP_URL': JSON.stringify(process.env.APP_URL),
    },
    // server: {
    //     host: true,
    //     port: 5173,
    //     hmr: {
    //         host: '192.168.5.154',
    //     },
    // },
});
