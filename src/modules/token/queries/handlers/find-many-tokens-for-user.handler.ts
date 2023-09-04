import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindManyTokensForUserQuery } from '../impl'
import { Token } from '@prisma/client'
import { TokenRepository } from '../../token.repository'
import { NotFoundException } from '@nestjs/common'

@QueryHandler(FindManyTokensForUserQuery)
export class FindManyTokensForUserHandler
	implements IQueryHandler<FindManyTokensForUserQuery>
{
	constructor(protected readonly tokenRepository: TokenRepository) {}

	async execute({ dto: { userId } }: FindManyTokensForUserQuery): Promise<Token[]> {
		const tokens: Token[] | null = await this.tokenRepository.findManyTokensForUser({
			userId
		})

		if (!tokens) throw new NotFoundException(`Any tokens weren't found`)

		return tokens
	}
}
