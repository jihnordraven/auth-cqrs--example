import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
	imports: [CqrsModule],
	controllers: [UserController],
	providers: [UserService, UserRepository],
	exports: [UserRepository]
})
export class UserModule {}
