import { env } from "@/core/env"
import * as jose from "jose"

const secret = new TextEncoder().encode(env.JWT_SECRET)
const alg = "HS256"

export type JWTPayload = {
	pennkey: string
}

export const jwt = {
	sign: async (payload: JWTPayload): Promise<string> => {
		const jwt = await new jose.SignJWT(payload)
			.setProtectedHeader({ alg })
			.setIssuedAt()
			.setIssuer("edu:upenn:seas:cis1962")
			.setAudience("edu:upenn:seas:cis1962")
			.setExpirationTime("120d")
			.sign(secret)
		return jwt
	},
	verify: async (token: string): Promise<JWTPayload> => {
		const { payload } = await jose.jwtVerify<JWTPayload>(token, secret, {
			algorithms: [alg],
			issuer: "edu:upenn:seas:cis1962",
			audience: "edu:upenn:seas:cis1962",
		})
		return payload
	},
}
