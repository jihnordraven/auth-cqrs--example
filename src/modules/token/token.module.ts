import { Module } from '@nestjs/common'
import { TokenService } from './token.service'
import { TokenController } from './token.controller'
import { TokenRepository } from './token.repository'
import { CqrsModule } from '@nestjs/cqrs'
import {
	DeleteManyTokensForUserHandler,
	DeleteOneTokenForUserHandler
} from './commands/handlers'
import { FindManyTokensForUserHandler, FindOneTokenForUserHandler } from './queries/handlers'

const commandHandlers = [DeleteManyTokensForUserHandler, DeleteOneTokenForUserHandler]

const queryHandlers = [FindManyTokensForUserHandler, FindOneTokenForUserHandler]

@Module({
	imports: [CqrsModule],
	controllers: [TokenController],
	providers: [TokenService, TokenRepository, ...commandHandlers, ...queryHandlers],
	exports: [TokenRepository]
})
export class TokenModule {}
