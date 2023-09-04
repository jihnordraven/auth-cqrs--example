import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteManyTokensForUserCommand } from '../impl'
import { TokenRepository } from '../../token.repository'
import { NotFoundException } from '@nestjs/common'

@CommandHandler(DeleteManyTokensForUserCommand)
export class DeleteManyTokensForUserHandler
	implements ICommandHandler<DeleteManyTokensForUserCommand>
{
	constructor(protected readonly tokenRepository: TokenRepository) {}

	async execute({ dto: { userId } }: DeleteManyTokensForUserCommand): Promise<void> {
		const isSuccess: boolean = await this.tokenRepository.deleteManyTokensForUser({
			userId
		})

		if (!isSuccess) throw new NotFoundException(`Any tokens weren't found`)
	}
}
