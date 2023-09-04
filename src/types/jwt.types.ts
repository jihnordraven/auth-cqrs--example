import { Token } from '@prisma/client'

export type Tokens = {
	readonly accessToken: string

	readonly refreshToken: Token
}

export type JwtPayloadType = {
	readonly userId: string
}
