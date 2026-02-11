import "dotenv/config"
import { createServer } from "node:http"

import { OpenAPIHandler } from "@orpc/openapi/node"
import { RPCHandler } from "@orpc/server/node"
import { CORSPlugin } from "@orpc/server/plugins"
import { ZodSmartCoercionPlugin } from "@orpc/zod" // <-- zod v3

import { env } from "@/core/env"
import { router } from "@/routes/index.route"
import { match } from "ts-pattern"

class PathUnmatchedError extends Error {
	constructor() {
		super("Unmatched path")
	}
}

const rpcHandler = new RPCHandler(router, {
	plugins: [new CORSPlugin(), new ZodSmartCoercionPlugin()],
})
const openAPIHandler = new OpenAPIHandler(router, {
	plugins: [new CORSPlugin(), new ZodSmartCoercionPlugin()],
})

type Handler = typeof rpcHandler | typeof openAPIHandler
type Prefix = "/api" | "/rpc"

const server = createServer(async (req, res) => {
	try {
		if (!req.url) {
			throw new PathUnmatchedError()
		}
		const [prefix, handler] = match(req.url)
			.when(
				(path) => path.startsWith("/api"),
				() => ["/api" as const, openAPIHandler] as [Prefix, Handler]
			)
			.when(
				(path) => path.startsWith("/rpc"),
				() => ["/rpc" as const, rpcHandler] as [Prefix, Handler]
			)
			.otherwise(() => {
				throw new PathUnmatchedError()
			})
		const { matched } = await handler.handle(req, res, {
			prefix,
			context: { headers: req.headers },
		})
		if (!matched) {
			throw new PathUnmatchedError()
		}
	} catch (error) {
		console.error(error)
		if (error instanceof PathUnmatchedError) {
			res.statusCode = 404
			return res.end("No procedure matched")
		}
		res.statusCode = 500
		return res.end("Internal server error")
	}
})

server.listen(env.PORT, "0.0.0.0", () =>
	console.log(`🚀 Listening on 0.0.0.0:${env.PORT}`)
)
