import { defineConfig } from "vite";

// Treat Tiled tileset files as assets instead of TypeScript JSX.
const tiledPlugin = () => {
    return {
        name: 'tiled-tileset-plugin',
        resolveId: {
            order: 'pre',
            handler(sourceId, importer, options) {
                if (!sourceId.endsWith(".tsx")) return;
                return { id: 'tileset:' + sourceId, external: 'relative' }
            }
        }
    };
}

export default defineConfig({
    base: './',
    plugins: [tiledPlugin()],
    optimizeDeps: {
        exclude: ["excalibur"],
    },
    build: {
        // Excalibur needs asset URLs and cannot load Vite-inlined XML data URLs.
        assetsInlineLimit: 0,
        sourcemap: true,
    }
});
