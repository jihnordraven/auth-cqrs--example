import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { GenerateTokensCommand } from '../impl'
import { JwtService } from '@nestjs/jwt'
import { TokenRepository } from 'src/modules/token/token.repository'
import { ConfigService } from '@nestjs/config'
import { Token } from '@prisma/client'
import { Tokens } from 'src/types'
import { InternalServerErrorException } from '@nestjs/common'

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensHandler implements ICommandHandler<GenerateTokensCommand> {
	constructor(
		protected readonly configService: ConfigService,
		protected readonly jwtService: JwtService,
		protected readonly tokenRepository: TokenRepository
	) {}

	async execute({
		dto: { userId, userAgent, userIp }
	}: GenerateTokensCommand): Promise<Tokens> {
		const accessToken: string = await this.jwtService.signAsync(
			{ userId: userId },
			{ secret: this.configService.get<string>('JWT_ACCESS_SECRET'), expiresIn: '7d' }
		)

		const refreshToken: Token | null = await this.tokenRepository.createOne({
			userId,
			userAgent,
			userIp
		})

		if (!accessToken || !refreshToken)
			throw new InternalServerErrorException('Unable to create tokens')

		return { accessToken, refreshToken }
	}
}
