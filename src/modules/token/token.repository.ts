import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '@modules/prisma/prisma.service'
import { Token } from '@prisma/client'
import { v4 } from 'uuid'
import { add } from 'date-fns'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class TokenRepository {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {}

	async createOne({
		userId,
		userAgent,
		userIp
	}: {
		userId: string
		userAgent: string
		userIp: string
	}): Promise<Token> {
		const _token: Token | null = await this.prisma.token.findFirst({
			where: { userId, userAgent, userIp }
		})

		const token: string = _token?.token ?? ''

		return this.prisma.token.upsert({
			where: { token },
			update: {
				token: v4(),
				exp: add(new Date(), { months: 7 })
			},
			create: {
				token: v4(),
				exp: add(new Date(), { months: 7 }),
				userId,
				userAgent,
				userIp
			}
		})
	}

	async findByToken({ token }: { token: string }): Promise<Token | null> {
		const refreshToken: Token | null = await this.cacheManager.get(
			`token-by-token:${token}`
		)
		if (!refreshToken) {
			const refreshToken: Token | null = await this.prisma.token.findUnique({
				where: { token }
			})
			if (!refreshToken) return null
			await this.cacheManager.set(
				`token-by-token:${token}`,
				refreshToken,
				Number(refreshToken.exp)
			)
			return refreshToken
		}
		return refreshToken
	}

	async findOneByTokenId({ tokenId }: { tokenId: string }): Promise<Token | null> {
		const refreshToken: Token | null = await this.cacheManager.get(
			`token-by-token-id:${tokenId}`
		)
		if (!refreshToken) {
			const refreshToken: Token | null = await this.prisma.token.findUnique({
				where: { id: tokenId }
			})
			if (!refreshToken) return null
			await this.cacheManager.set(
				`token-by-token-id:${tokenId}`,
				refreshToken,
				Number(refreshToken.exp)
			)
			return refreshToken
		}
		return refreshToken
	}

	async deleteOne({
		userId,
		userAgent,
		userIp
	}: {
		userId: string
		userAgent: string
		userIp: string
	}): Promise<boolean> {
		const _token: Token | null = await this.prisma.token.findFirst({
			where: { userId, userAgent, userIp }
		})
		const token: string = _token?.token ?? ''

		return Boolean(
			await this.prisma.token.delete({
				where: { token }
			})
		)
	}

	async deleteOneByTokenId({ tokenId }: { tokenId: string }): Promise<boolean> {
		return Boolean(await this.prisma.token.delete({ where: { id: tokenId } }))
	}

	async deleteManyTokensForUser({ userId }: { userId: string }): Promise<boolean> {
		return Boolean(await this.prisma.token.deleteMany({ where: { userId } }))
	}

	async findOneTokenForUser({ tokenId }: { tokenId: string }): Promise<Token> {
		const token: Token | null = await this.cacheManager.get(
			`find-one-token-for-user:${tokenId}`
		)
		if (!token) {
			const token: Token | null = await this.prisma.token.findUnique({
				where: { id: tokenId }
			})
			if (!token) return null
			await this.cacheManager.set(
				`find-one-token-for-user:${token}`,
				token,
				Number(token.exp)
			)
			return token
		}
		return token
	}

	async findManyTokensForUser({ userId }: { userId: string }): Promise<Token[]> {
		const tokens: Token[] | null = await this.cacheManager.get(
			`find-many-tokens-for-user:${userId}`
		)
		if (!tokens) {
			const tokens: Token[] | null = await this.prisma.token.findMany({
				where: { userId }
			})
			if (!tokens) return null
			await this.cacheManager.set(`find-many-tokens-for-user:${userId}`, tokens, 500)
			return tokens
		}
		return tokens
	}
}
