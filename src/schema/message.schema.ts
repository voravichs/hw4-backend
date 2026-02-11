import z from "zod"

export const messageSchema = z.object({
	role: z.string(),
	content: z.string(),
})

export type Message = z.infer<typeof messageSchema>
