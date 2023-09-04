import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindOneTokenForUserQuery } from '../impl'
import { Token } from '@prisma/client'
import { TokenRepository } from '../../token.repository'
import { ForbiddenException, NotFoundException } from '@nestjs/common'

@QueryHandler(FindOneTokenForUserQuery)
export class FindOneTokenForUserHandler implements IQueryHandler<FindOneTokenForUserQuery> {
	constructor(protected readonly tokenRepository: TokenRepository) {}

	async execute({ dto: { userId, tokenId } }: FindOneTokenForUserQuery): Promise<Token> {
		const token: Token | null = await this.tokenRepository.findOneTokenForUser({ tokenId })

		if (!token) throw new NotFoundException('Token not found')

		if (token.userId !== userId)
			throw new ForbiddenException(`This token doesn't belongs to you`)

		return token
	}
}
