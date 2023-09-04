import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	UseGuards
} from '@nestjs/common'
import { JwtGuard } from '@guards'
import { JwtPayloadDecorator } from '@decorators'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { DeleteManyTokensForUserCommand, DeleteOneTokenForUserCommand } from './commands/impl'
import { FindManyTokensForUserQuery, FindOneTokenForUserQuery } from './queries/impl'

@Controller('token')
export class TokenController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	@Get()
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	async getManyForUser(@JwtPayloadDecorator('id') userId: string): Promise<void> {
		await this.queryBus.execute(new FindManyTokensForUserQuery({ userId }))
	}

	@Get(':tokenId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	async getOneForUser(
		@Param('tokenId') tokenId: string,
		@JwtPayloadDecorator('id') userId: string
	): Promise<void> {
		await this.queryBus.execute(new FindOneTokenForUserQuery({ userId, tokenId }))
	}

	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	async deleteManyForUser(@JwtPayloadDecorator('id') userId: string): Promise<void> {
		await this.commandBus.execute(new DeleteManyTokensForUserCommand({ userId }))
	}

	@Delete(':tokenId')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(JwtGuard)
	async deleteOneForUser(
		@Param('tokenId') tokenId: string,
		@JwtPayloadDecorator('id') userId: string
	): Promise<void> {
		await this.commandBus.execute(new DeleteOneTokenForUserCommand({ userId, tokenId }))
	}
}
