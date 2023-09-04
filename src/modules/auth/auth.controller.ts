import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Ip,
	Post,
	Query,
	Res,
	UseGuards
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import {
	GenerateTokensCommand,
	GoogleRegisterCommand,
	LocalRegisterCommand,
	LogoutCommand,
	PasswordRecoveryCommand,
	PasswordRecoveryConfirmCommand,
	RegisterConfirmCommand,
	ResendEmailCodeCommand,
	ValidateTokenCommand
} from './commands/impl'
import { Tokens } from '@types'
import {
	CookieDecorator,
	GooglePayloadDecorator,
	JwtPayloadDecorator,
	UserAgentDecorator,
	LocalPayloadDecorator
} from 'src/decorators'
import { GoogleGuard, IsEmailConfirmGuard, JwtGuard, LocalGuard } from '@guards'
import { Response } from 'express'
import { REFRESH_TOKEN } from '@constants'
import { GoogleProfile } from '@prisma/client'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	private async setTokensToResponse({
		tokens,
		res
	}: {
		tokens: Tokens
		res: Response
	}): Promise<void> {
		res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
			httpOnly: true,
			secure: false,
			expires: tokens.refreshToken.exp,
			sameSite: 'lax'
		})
		res.json({ accessToken: tokens.accessToken })
	}

	@Post('register')
	@HttpCode(HttpStatus.NO_CONTENT)
	async register(
		@Body()
		{ username, email, password }: { username: string; email: string; password: string }
	): Promise<void> {
		await this.commandBus.execute(new LocalRegisterCommand({ username, email, password }))
	}

	@Get('register-confirm')
	@HttpCode(HttpStatus.NO_CONTENT)
	async registerConfirm(@Query('code') code: string): Promise<void> {
		await this.commandBus.execute(new RegisterConfirmCommand({ code }))
	}

	@Post('resend-email-code')
	@HttpCode(HttpStatus.NO_CONTENT)
	async resendEmailCode(@Body('email') email: string): Promise<void> {
		await this.commandBus.execute(new ResendEmailCodeCommand({ email }))
	}

	@Post('password-recovery')
	@HttpCode(HttpStatus.NO_CONTENT)
	async passwordRecovery(@Body('email') email: string): Promise<void> {
		await this.commandBus.execute(new PasswordRecoveryCommand({ email }))
	}

	@Post('password-recovery-confirm')
	@HttpCode(HttpStatus.NO_CONTENT)
	async passwordRecoveryConfirm(
		@Body() { code, newPassword }: { code: string; newPassword: string }
	): Promise<void> {
		await this.commandBus.execute(
			new PasswordRecoveryConfirmCommand({ code, newPassword })
		)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalGuard, IsEmailConfirmGuard)
	async login(
		@LocalPayloadDecorator('id') userId: string,
		@UserAgentDecorator() userAgent: string,
		@Ip() userIp: string,
		@Res() res: Response
	): Promise<void> {
		const tokens: Tokens = await this.commandBus.execute(
			new GenerateTokensCommand({ userId, userAgent, userIp })
		)
		return this.setTokensToResponse({ tokens, res })
	}

	@Post('new-tokens')
	@HttpCode(HttpStatus.OK)
	async newTokens(
		@CookieDecorator(REFRESH_TOKEN) refreshToken: string,
		@UserAgentDecorator() userAgent: string,
		@Ip() userIp: string,
		@Res() res: Response
	): Promise<void> {
		const userId: string = await this.queryBus.execute(
			new ValidateTokenCommand({ token: refreshToken })
		)
		const tokens: Tokens = await this.commandBus.execute(
			new GenerateTokensCommand({ userId, userAgent, userIp })
		)
		return this.setTokensToResponse({ tokens, res })
	}

	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	async logout(
		@JwtPayloadDecorator('id') userId: string,
		@UserAgentDecorator() userAgent: string,
		@Ip() userIp: string
	): Promise<void> {
		await this.commandBus.execute(new LogoutCommand({ userId, userAgent, userIp }))
	}

	@Get('google')
	@UseGuards(GoogleGuard)
	async google() {}

	@Get('google/callback')
	@HttpCode(HttpStatus.OK)
	@UseGuards(GoogleGuard)
	async googleCallback(
		@GooglePayloadDecorator() user,
		@UserAgentDecorator() userAgent: string,
		@Ip() userIp: string,
		@Res() res: Response
	): Promise<void> {
		const googleProfile: GoogleProfile = await this.commandBus.execute(
			new GoogleRegisterCommand(user)
		)
		const tokens: Tokens = await this.commandBus.execute(
			new GenerateTokensCommand({ userId: googleProfile.userId, userAgent, userIp })
		)
		return this.setTokensToResponse({ tokens, res })
	}
}
