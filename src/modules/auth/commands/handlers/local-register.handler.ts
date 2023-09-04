import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { LocalRegisterCommand } from '../impl'
import { UserRepository } from 'src/modules/user/user.repository'
import { ConflictException } from '@nestjs/common'
import { BcryptAdapter, MailerAdapter } from 'src/adapters'
import { EmailCode, PasswordCode, User } from '@prisma/client'
import { EmailCodeRepository } from 'src/modules/email-code/email-code.repository'
import { PasswordCodeRepository } from 'src/modules/password-code/password-code.repository'

@CommandHandler(LocalRegisterCommand)
export class LocalRegisterHandler implements ICommandHandler<LocalRegisterCommand> {
	constructor(
		protected readonly userRepository: UserRepository,
		protected readonly bcryptAdapter: BcryptAdapter,
		protected readonly emailCodeRepository: EmailCodeRepository,
		protected readonly mailerAdapter: MailerAdapter,
		protected readonly passwordCodeRepository: PasswordCodeRepository
	) {}

	async execute({
		dto: { username, email, password }
	}: LocalRegisterCommand): Promise<void> {
		const isEmail: boolean = await this.userRepository.checkUniqueEmail({ email })
		if (isEmail) throw new ConflictException('This email is already exist')

		const isUsername: boolean = await this.userRepository.checkUniqueUsername({
			username
		})
		if (isUsername) throw new ConflictException('This username is already exist')

		const hashPassword: string = await this.bcryptAdapter.hash({ password })

		const user: User = await this.userRepository.createUser({
			username,
			email,
			hashPassword
		})

		const emailCode: EmailCode = await this.emailCodeRepository.createCode({
			userId: user.id
		})

		await this.mailerAdapter.sendMail({ email: user.email, code: emailCode.code })
	}
}
