import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { CqrsModule } from '@nestjs/cqrs'
import { TokenModule } from '../token/token.module'
import { EmailCodeModule } from '../email-code/email-code.module'
import { UserModule } from '../user/user.module'
import { LocalRegisterHandler } from './commands/handlers/local-register.handler'
import {
	GenerateTokensHandler,
	GoogleRegisterHandler,
	LogoutHandler,
	RegisterConfirmHandler,
	ResendEmailCodeHandler,
	ValidateTokenHandler
} from './commands/handlers'
import { BcryptAdapter, MailerAdapter } from '@adapters'
import { JwtModule } from '@nestjs/jwt'
import { PasswordCodeModule } from '../password-code/password-code.module'
import { ValidateUserHandler } from './queries/handlers'

const adapters = [BcryptAdapter, MailerAdapter]

const commandHandlers = [
	LocalRegisterHandler,
	RegisterConfirmHandler,
	ResendEmailCodeHandler,
	GenerateTokensHandler,
	ValidateTokenHandler,
	LogoutHandler,
	GoogleRegisterHandler
]

const queryHandlers = [ValidateUserHandler]

@Module({
	imports: [
		CqrsModule,
		JwtModule,
		TokenModule,
		EmailCodeModule,
		UserModule,
		PasswordCodeModule
	],
	controllers: [AuthController],
	providers: [AuthService, ...commandHandlers, ...adapters, ...queryHandlers]
})
export class AuthModule {}
