import { Controller, Delete, Get, Param } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

@Controller('user')
export class UserController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	@Get()
	async getAllUsers(): Promise<void> {}

	@Get(':id')
	async getUser(@Param('id') userId: string): Promise<void> {}

	@Delete(':id')
	async deleteOne(@Param('id') userId: string): Promise<void> {}
}
