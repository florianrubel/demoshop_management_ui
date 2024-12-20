import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
// @ts-expect-error Because a wrong error message is appering
import eslintPlugin from 'vite-plugin-eslint';

import tsconfigPaths from 'vite-tsconfig-paths';

import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        mkcert(),
        eslintPlugin(),
        tsconfigPaths(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./src', import.meta.url)),
            '~api': fileURLToPath(new URL('./src/sharedLib/api/src', import.meta.url)),
        },
    },
});
