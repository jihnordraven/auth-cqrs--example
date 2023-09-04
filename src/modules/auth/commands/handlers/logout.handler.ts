import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { LogoutCommand } from '../impl'
import { TokenRepository } from 'src/modules/token/token.repository'
import { UnauthorizedException } from '@nestjs/common'

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
	constructor(protected readonly tokenRepository: TokenRepository) {}

	async execute({ dto: { userId, userAgent, userIp } }: LogoutCommand): Promise<void> {
		const isSuccess: boolean = await this.tokenRepository.deleteOne({
			userId,
			userAgent,
			userIp
		})

		if (!isSuccess)
			throw new UnauthorizedException('Token not found or dont belongs to you')

		return null
	}
}
