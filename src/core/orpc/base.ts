import type { IncomingHttpHeaders } from "node:http"

import { os } from "@orpc/server"

export interface Context {
	headers: IncomingHttpHeaders
}

export const base = os
	.errors({
		UNAUTHORIZED: {
			message: "Unauthorized",
			code: "UNAUTHORIZED",
		},
		FORBIDDEN: {
			message: "Forbidden",
			code: "FORBIDDEN",
		},
		NOT_FOUND: {
			message: "Not Found",
			code: "NOT_FOUND",
		},
		BAD_REQUEST: {
			message: "Bad Request",
			code: "BAD_REQUEST",
		},
		INTERNAL_SERVER_ERROR: {
			message: "Internal Server Error",
			code: "INTERNAL_SERVER_ERROR",
		},
		CONFLICT: {
			message: "Conflict",
			code: "CONFLICT",
		},
	})
	.$context<Context>()
	.$route({
		path: "/",
	})
