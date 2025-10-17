import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "WebSocketClient",
			formats: ["es", "cjs", "umd"],
			fileName: (format) => {
				switch (format) {
					case "es":
						return "index.esm.js";
					case "cjs":
						return "index.js";
					case "umd":
						return "index.umd.js";
					default:
						return "index.js";
				}
			},
		},
		rollupOptions: {
			external: [],
			output: {
				globals: {},
			},
		},
		sourcemap: true,
		minify: true,
		target: "es2020",
	},
	plugins: [
		dts({
			include: ["src/**/*"],
			exclude: [
				"src/**/*.test.ts",
				"src/**/*.spec.ts",
				"src/test-setup.ts",
				".yarn/**",
				".github/**",
				"coverage/**",
				"examples/**",
				"**/*.md",
			],
			outDir: "dist",
			rollupTypes: true,
		}),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
});
