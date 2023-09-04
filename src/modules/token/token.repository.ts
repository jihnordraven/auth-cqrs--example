import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Token } from '@prisma/client'
import { v4 } from 'uuid'
import { add } from 'date-fns'

@Injectable()
export class TokenRepository {
	constructor(private readonly prisma: PrismaService) {}

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
		return this.prisma.token.findUnique({ where: { token } })
	}

	async findOneByTokenId({ tokenId }: { tokenId: string }): Promise<Token | null> {
		return this.prisma.token.findUnique({ where: { id: tokenId } })
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
		return this.prisma.token.findUnique({ where: { id: tokenId } })
	}

	async findManyTokenForUser({ userId }: { userId: string }): Promise<Token[]> {
		return this.prisma.token.findMany({ where: { userId } })
	}
}
