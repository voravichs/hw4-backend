import { resolve } from "path"

import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.test.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/**/*.ts"],
			exclude: ["src/**/*.{test,spec}.ts"],
		},
		env: {
			JWT_SECRET: "test-jwt-secret-key-for-testing-only",
			UPSTASH_REDIS_REST_URL: "https://test-redis-url.upstash.io",
			UPSTASH_REDIS_REST_TOKEN: "test-redis-token",
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
})
