import "dotenv/config"
import { jwt } from "@/core/jwt"

const STUDENTS = ["makhij", "darshk", "alliemi", "muradli1", "pragya7","aasri", "taoren","wangcy07","didrik"]

const main = async () => {
	const tokens = await Promise.all(
		STUDENTS.map(async (student) => {
			return {
				pennkey: student,
				token: await jwt.sign({
					pennkey: student,
				}),
			}
		})
	)
	console.log(JSON.stringify(tokens, null, 2))
}

main()
