import { base } from "@/core/orpc/base"
import { chatSchema } from "@/schema/chat.schema"
import { messageSchema } from "@/schema/message.schema"
import z from "zod"
import cuid2 from "@paralleldrive/cuid2"
import { chatService } from "@/core/orpc/chat"
import { ChatNotFoundError } from "@/services/chat.service"

export const chatRoutes = base.router({
	list: base
		.route({
			method: "GET",
			path: "/",
		})
		.use(chatService)
		.handler(async ({ context }) => {
			return context.chatService.list()
		}),
	create: base
		.route({
			method: "POST",
			path: "/",
		})
		.use(chatService)
		.handler(async ({ context }) => {
			const id = cuid2.createId()
			return context.chatService.create({ id, messages: [] })
		}),
	get: base
		.route({
			method: "GET",
			path: "/{id}",
		})
		.use(chatService)
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input, errors }) => {
			try {
				return await context.chatService.get(input.id)
			} catch (error) {
				if (error instanceof ChatNotFoundError) {
					throw errors.NOT_FOUND({ message: "Chat not found" })
				}
				throw error
			}
		}),
	update: base
		.route({
			method: "PUT",
			path: "/{id}",
		})
		.use(chatService)
		.input(chatSchema)
		.handler(async ({ context, input, errors }) => {
			try {
				return await context.chatService.update(input.id, input)
			} catch (error) {
				if (error instanceof ChatNotFoundError) {
					throw errors.NOT_FOUND({ message: "Chat not found" })
				}
				throw error
			}
		}),
	delete: base
		.route({
			method: "DELETE",
			path: "/{id}",
		})
		.use(chatService)
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			return await context.chatService.delete(input.id)
		}),
	clear: base
		.route({
			method: "DELETE",
			path: "/",
		})
		.use(chatService)
		.handler(async ({ context }) => {
			return await context.chatService.clear()
		}),
})
