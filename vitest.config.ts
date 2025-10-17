/// <reference types="vitest" />
/// <reference types="vitest/globals" />
import { defineConfig } from "vite";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/test-setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html", "lcov"],
			exclude: [
				"node_modules/",
				"dist/",
				"coverage/",
				".yarn/",
				".github/",
				".husky/",
				"**/*.d.ts",
				"**/*.test.ts",
				"**/*.spec.ts",
				"**/*.md",
				"src/test-setup.ts",
				"examples/",
				"vite.config.ts",
				"vitest.config.ts",
				"biome.json",
				"tsconfig.json",
				"package.json",
				"yarn.lock",
				".gitignore",
				".npmignore",
				".lintstagedrc",
				".yarnrc.yml",
			],
		},
		include: ["src/**/__tests__/*.test.ts"],
		exclude: [
			"node_modules/", 
			"dist/", 
			"examples/", 
			".yarn/",
			".github/",
			".husky/",
			"coverage/",
			"**/*.md"
		],
	},
});
