import { TokenRepository } from './../../../token/token.repository'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ValidateTokenCommand } from '../impl'
import { Token } from '@prisma/client'
import { NotFoundException, UnauthorizedException } from '@nestjs/common'

@CommandHandler(ValidateTokenCommand)
export class ValidateTokenHandler implements ICommandHandler<ValidateTokenCommand> {
	constructor(protected readonly tokenRepository: TokenRepository) {}

	async execute({ dto: { token } }: ValidateTokenCommand): Promise<string> {
		const isToken: Token | null = await this.tokenRepository.findByToken({ token })
		if (!isToken) throw new NotFoundException('Token not found')

		const isTokenExpired: boolean = Boolean(new Date(isToken.exp) < new Date())
		if (isTokenExpired) throw new UnauthorizedException('Token has expired')

		return isToken.userId
	}
}
