import { env } from "@/core/env"
import { base } from "@/core/orpc/base"
import { chatRoutes } from "@/routes/chat.route"
import { defaultChatRoutes } from "@/routes/default-chat.route"
import { onError } from "@orpc/server"

export const router = base
	.use(onError((error) => console.error(error)))
	.router({
		chat: base.prefix("/chat").router(chatRoutes),
		messages: base.prefix("/messages").router(defaultChatRoutes),
		version: base
			.route({
				method: "GET",
				path: "/version",
			})
			.handler(async () => {
				return {
					version: env.VERSION,
				}
			}),
	})
