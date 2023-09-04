import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ValidateUserQuery } from '../impl'
import { User } from '@prisma/client'
import { UserRepository } from '@modules/user/user.repository'
import { UnauthorizedException } from '@nestjs/common'
import { BcryptAdapter } from '@adapters'

@QueryHandler(ValidateUserQuery)
export class ValidateUserHandler implements IQueryHandler<ValidateUserQuery> {
	constructor(
		protected readonly userRepository: UserRepository,
		protected readonly bcryptAdapter: BcryptAdapter
	) {}

	async execute({ dto: { email, password } }: ValidateUserQuery): Promise<User> {
		const user: User | null = await this.userRepository.findOneByEmail({ email })
		if (!user) return null

		const isValidPassword: boolean = await this.bcryptAdapter.compare({
			password,
			hashPassword: user.hashPassword
		})
		if (!isValidPassword) return null

		return user
	}
}
