import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/lambda.ts"],
	platform: "node",
	target: "esnext",
	clean: true,
	format: ["cjs"],
	noExternal: [/(.*)/],
})
