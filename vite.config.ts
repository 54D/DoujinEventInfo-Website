import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
        react()
    ],
    resolve: {
        alias: {
            "@" : path.resolve(__dirname, "/src"),
            "@assets": path.resolve(__dirname, "/src/assets"),
            "@components": path.resolve(__dirname, "/src/components"),
            "@contexts": path.resolve(__dirname, "/src/contexts"),
            "@routes": path.resolve(__dirname, "/src/routes"),
            "@utils": path.resolve(__dirname, "/src/utils"),
        }
    }
})
