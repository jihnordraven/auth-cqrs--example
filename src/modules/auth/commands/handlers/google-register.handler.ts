import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { GoogleRegisterCommand } from '../impl'
import { UserRepository } from 'src/modules/user/user.repository'
import { GoogleProfile, User } from '@prisma/client'

@CommandHandler(GoogleRegisterCommand)
export class GoogleRegisterHandler implements ICommandHandler<GoogleRegisterCommand> {
	constructor(protected readonly userRepository: UserRepository) {}

	async execute({ dto }: GoogleRegisterCommand): Promise<GoogleProfile> {
		const user: User | null = await this.userRepository.findOneByEmail({
			email: dto.email
		})

		if (!user) {
			const user = await this.userRepository.createUser({
				email: dto.email,
				username: dto.username
			})
			return this.userRepository.createGoogleProfile({
				providerId: dto.providerId,
				username: dto.username,
				email: dto.email,
				firstName: dto.firstName,
				lastName: dto.lastName,
				displayName: dto.displayName,
				userId: user.id
			})
		}

		const googleProfile: GoogleProfile | null =
			await this.userRepository.findOneGoogleProfileByUserId({ userId: user.id })

		if (!googleProfile) {
			console.log('user')
			console.log(user)
			console.log('user')
			console.log('dto')
			console.log(dto)
			console.log('dto')
			return this.userRepository.createGoogleProfile({
				providerId: dto.providerId,
				username: dto.username,
				email: dto.email,
				firstName: dto.firstName,
				lastName: dto.lastName,
				displayName: dto.displayName,
				userId: user.id
			})
		}

		return googleProfile
	}
}
