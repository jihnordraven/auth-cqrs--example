import { Inject, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@modules/prisma/prisma.service'
import { EmailStatusEnum, GoogleProfile, RolesEnum, User } from '@prisma/client'
import { red } from 'colorette'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class UserRepository {
	private readonly logger: Logger = new Logger(UserRepository.name)

	constructor(
		private readonly prisma: PrismaService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {}

	async findOneByEmail({ email }: { email: string }): Promise<User | null> {
		const user: User | null = await this.cacheManager.get(email)
		if (!user) {
			const user: User | null = await this.prisma.user.findUnique({ where: { email } })
			if (!user) return null
			await this.cacheManager.set(email, user)
			return user
		}
		return user
	}

	async findOneUserById({ userId }: { userId: string }): Promise<User | null> {
		const user: User | null = await this.cacheManager.get(userId)
		if (!user) {
			const user: User | null = await this.prisma.user.findUnique({
				where: { id: userId }
			})
			if (!user) return null
			await this.cacheManager.set(userId, user)
			return user
		}
		return user
	}

	async checkUniqueEmail({ email }: { email: string }): Promise<boolean> {
		const isEmail: boolean = await this.cacheManager.get(`boolean-${email}`)
		if (!isEmail) {
			const isEmail: boolean = Boolean(
				await this.prisma.user.findUnique({ where: { email } })
			)
			if (!isEmail) return null
			await this.cacheManager.set(`boolean-${email}`, isEmail, 3600)
			return isEmail
		}
		return isEmail
	}

	async checkUniqueUsername({ username }: { username: string }): Promise<boolean> {
		const isUsername: boolean = await this.cacheManager.get(`boolean-${username}`)
		if (!isUsername) {
			const isUsername: boolean = Boolean(
				await this.prisma.user.findUnique({ where: { username } })
			)
			if (!isUsername) return null
			await this.cacheManager.set(`boolean-${username}`, isUsername, 3600)
			return isUsername
		}
		return isUsername
	}

	async createUser({
		username,
		email,
		hashPassword
	}: {
		username?: string
		email: string
		hashPassword?: string
	}): Promise<User> {
		return this.prisma.user.create({
			data: {
				username,
				email,
				hashPassword,
				roleName: RolesEnum.USER,
				emailStatusName: EmailStatusEnum.PENDING
			}
		})
	}

	async emailConfirm({ userId }: { userId: string }): Promise<void> {
		await this.prisma.user
			.update({
				where: { id: userId },
				data: { emailStatusName: EmailStatusEnum.CONFIRMED }
			})
			.catch((err: unknown) =>
				this.logger.error(red(`Unable to confirm user's email. Learn more at: ${err}`))
			)
	}

	async createGoogleProfile({
		providerId,
		username = null,
		email,
		firstName = null,
		lastName = null,
		displayName = null,
		userId
	}: {
		providerId: string
		username: string
		email: string
		firstName: string
		lastName: string
		displayName: string
		userId: string
	}): Promise<GoogleProfile> {
		console.log({ providerId, username, email, firstName, lastName, displayName, userId })
		return await this.prisma.googleProfile.create({
			data: {
				providerId,
				username,
				email,
				firstName,
				lastName,
				displayName,
				userId
			}
		})
	}

	async findOneGoogleProfile({
		providerId
	}: {
		providerId: string
	}): Promise<GoogleProfile | null> {
		return this.prisma.googleProfile.findUnique({ where: { providerId } })
	}

	async findOneGoogleProfileByUserId({
		userId
	}: {
		userId: string
	}): Promise<GoogleProfile | null> {
		return this.prisma.googleProfile.findUnique({ where: { userId } })
	}

	async newPassword({
		userId,
		hashPassword
	}: {
		userId: string
		hashPassword: string
	}): Promise<void> {
		await this.prisma.user.update({
			where: { id: userId },
			data: { hashPassword }
		})
	}
}
