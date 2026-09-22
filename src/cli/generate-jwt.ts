import "dotenv/config"
import { jwt } from "@/core/jwt"

const STUDENTS = ["aryahuja", "ddarbha", "agosain", "kim301", "licamelm","dejah7", "melitski","kobike","voravich", "songh8", "dzabeli", "zhang009", "jclaner"]

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
