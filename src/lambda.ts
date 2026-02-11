import type { APIGatewayProxyEventV2 } from "aws-lambda"

import { OpenAPIHandler } from "@orpc/openapi/aws-lambda"
import { CORSPlugin } from "@orpc/server/plugins"
import { ZodSmartCoercionPlugin } from "@orpc/zod"
import { router } from "@/routes/index.route"

class PathUnmatchedError extends Error {
	constructor() {
		super("Unmatched path")
	}
}

const openAPIHandler = new OpenAPIHandler(router, {
	plugins: [new CORSPlugin(), new ZodSmartCoercionPlugin()],
})

export const handler = awslambda.streamifyResponse<APIGatewayProxyEventV2>(
	async (event, responseStream) => {
		console.log("handler", event)
		try {
			const { matched } = await openAPIHandler.handle(event, responseStream, {
				context: { headers: event.headers },
			})
			if (!matched) {
				throw new PathUnmatchedError()
			}
		} catch (error) {
			console.error(error)
			awslambda.HttpResponseStream.from(responseStream, {
				statusCode: 500,
			})
		} finally {
			responseStream.end()
		}
	}
)
