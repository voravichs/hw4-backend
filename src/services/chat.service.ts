import type { Chat } from "@/schema/chat.schema"
import { redis } from "@/core/redis"

export class ChatNotFoundError extends Error {
	constructor() {
		super("Chat not found")
	}
}

export class ChatService {
	private readonly pennkey: string
	constructor(private readonly context: { pennkey: string }) {
		this.pennkey = context.pennkey
	}

	async list(): Promise<string[]> {
		const chats = await redis.keys(`${this.pennkey}:chats:*`)
		const chatIds = chats
			.map((chat) => chat.split(":")[2])
			.filter((chat) => chat !== undefined) as string[]
		const uniqueChatIds = [...new Set([...chatIds, "default"])]
		return uniqueChatIds
	}

	async create(chat: Chat): Promise<Chat> {
		await redis.set(`${this.pennkey}:chats:${chat.id}`, chat)
		return chat
	}

	async get(id: string): Promise<Chat> {
		const chat = await redis.get<Chat>(`${this.pennkey}:chats:${id}`)
		if (!chat) {
			if (id === "default") {
				return await this.create({
					id: "default",
					messages: [],
				})
			}
			throw new ChatNotFoundError()
		}
		return chat
	}

	async update(id: string, chat: Chat): Promise<Chat> {
		await redis.set(`${this.pennkey}:chats:${id}`, chat)
		return chat
	}

	async delete(id: string): Promise<void> {
		await redis.del(`${this.pennkey}:chats:${id}`)
	}

	async clear(): Promise<void> {
		const chats = await redis.keys(`${this.pennkey}:chats:*`)
		await Promise.all(chats.map((chat) => redis.del(chat)))
	}
}
