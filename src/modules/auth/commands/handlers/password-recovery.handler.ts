import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PasswordRecoveryCommand } from '../impl'
import { PasswordCode, User } from '@prisma/client'
import { PasswordCodeRepository } from 'src/modules/password-code/password-code.repository'
import { UserRepository } from 'src/modules/user/user.repository'
import { NotFoundException } from '@nestjs/common'
import { MailerAdapter } from 'src/adapters'

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler implements ICommandHandler<PasswordRecoveryCommand> {
	constructor(
		protected readonly userRepository: UserRepository,
		protected readonly passwordCodeRepository: PasswordCodeRepository,
		protected readonly mailerAdapter: MailerAdapter
	) {}

	async execute({ dto: { email } }: PasswordRecoveryCommand): Promise<void> {
		const user: User = await this.userRepository.findOneByEmail({ email })
		if (!user) throw new NotFoundException('User not found')

		const passwordCode: PasswordCode = await this.passwordCodeRepository.create({
			userId: user.id
		})

		await this.mailerAdapter.sendMail({ email, code: passwordCode.code })
	}
}
