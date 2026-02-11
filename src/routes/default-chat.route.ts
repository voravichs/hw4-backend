import { base } from "@/core/orpc/base"
import { chatService } from "@/core/orpc/chat"
import { chatSchema } from "@/schema/chat.schema"

export const defaultChatRoutes = base.router({
	get: base
		.route({
			method: "GET",
			path: "/",
		})
		.use(chatService)
		.handler(async ({ context }) => {
			try {
				return context.chatService.get("default")
			} catch (error) {
				if (error instanceof Error && error.message === "Chat not found") {
					return context.chatService.create({
						id: "default",
						messages: [],
					})
				}
				throw error
			}
		}),
	update: base
		.route({
			method: "PUT",
			path: "/",
		})
		.use(chatService)
		.input(chatSchema)
		.handler(async ({ context, input }) => {
			return context.chatService.update("default", input)
		}),
})
