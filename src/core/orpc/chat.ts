import { requireAuth } from "@/core/orpc/authed"
import { ChatService } from "@/services/chat.service"

export const chatService = requireAuth.concat(({ context, next }) => {
	const chatService = new ChatService({
		pennkey: context.user.pennkey,
	})
	return next({
		context: {
			...context,
			chatService,
		},
	})
})
