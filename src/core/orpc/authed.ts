import { ORPCError } from "@orpc/server"
import { base } from "./base"
import { jwt } from "@/core/jwt"

const getUserByToken = async (token: string) => {
	const payload = await jwt.verify(token)
	return payload
}

export const requireAuth = base.middleware(
	async ({ context, next, errors }) => {
		const token = context.headers.authorization?.match(/Bearer (.*)/)?.[1]
		if (!token) {
			throw errors.UNAUTHORIZED()
		}
		try {
			const payload = await getUserByToken(token)
			return next({
				context: {
					...context,
					user: payload,
				},
			})
		} catch (error) {
			throw errors.UNAUTHORIZED()
		}
	}
)
