import { messageSchema } from "@/schema/message.schema"
import z from "zod"

export const chatSchema = z.object({
	id: z.string(),
	messages: z.array(messageSchema),
})

export type Chat = z.infer<typeof chatSchema>
