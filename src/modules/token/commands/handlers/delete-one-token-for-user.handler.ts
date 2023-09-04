import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteOneTokenForUserCommand } from '../impl'
import { TokenRepository } from '../../token.repository'
import { Token } from '@prisma/client'
import { ForbiddenException, NotFoundException } from '@nestjs/common'

@CommandHandler(DeleteOneTokenForUserCommand)
export class DeleteOneTokenForUserHandler
	implements ICommandHandler<DeleteOneTokenForUserCommand>
{
	constructor(protected readonly tokenRepository: TokenRepository) {}

	async execute({ dto: { userId, tokenId } }: DeleteOneTokenForUserCommand): Promise<void> {
		const token: Token | null = await this.tokenRepository.findOneByTokenId({ tokenId })
		if (!token) throw new NotFoundException('Token not found')

		const isTokenBelongsToUser: boolean = token.userId === userId
		if (!isTokenBelongsToUser) throw new ForbiddenException(`Token doesn't belongs to you`)

		await this.tokenRepository.deleteOneByTokenId({ tokenId })
	}
}
