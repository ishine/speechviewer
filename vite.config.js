import "dotenv/config.js";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fixReactVirtualized from "esbuild-plugin-react-virtualized";

export function express(path) {
	return {
		name: "vite-plugin-express",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				process.env.VITE = "true";
				try {
					const { createApp } = await server.ssrLoadModule(path);
					const app = await createApp(
						process.env.SPEECHVIEWER_DATASET_PATH,
						process.env.SPEECHVIEWER_DB_PATH,
					);
					app(req, res, next);
				} catch (e) {
					next(e);
				}
			});
		},
	};
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), express("api.js")],
	optimizeDeps: {
		esbuildOptions: {
			plugins: [fixReactVirtualized],
		},
	},
});
