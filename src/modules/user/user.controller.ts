import { Controller, Delete, Get, Param } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '@prisma/client'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getAllUsers(): Promise<void> {}

	@Get(':id')
	async getUser(@Param('id') userId: string): Promise<void> {}

	@Delete(':id')
	async deleteOne(@Param('id') userId: string): Promise<void> {}
}
