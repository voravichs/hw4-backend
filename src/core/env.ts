import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
	server: {
		PORT: z.coerce.number().default(8000),
		VERSION: z.string().default("unset"),
		JWT_SECRET: z.string(),

		UPSTASH_REDIS_REST_URL: z.string(),
		UPSTASH_REDIS_REST_TOKEN: z.string(),

		PREFIX: z.string().default("/api"),
	},
	runtimeEnv: process.env,
})
