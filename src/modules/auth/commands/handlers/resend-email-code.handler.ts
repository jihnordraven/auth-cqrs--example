import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ResendEmailCodeCommand } from '../impl'
import { EmailCode, User } from '@prisma/client'
import { UserRepository } from 'src/modules/user/user.repository'
import { EmailCodeRepository } from 'src/modules/email-code/email-code.repository'
import { MailerAdapter } from 'src/adapters'
import { NotFoundException } from '@nestjs/common'

@CommandHandler(ResendEmailCodeCommand)
export class ResendEmailCodeHandler implements ICommandHandler<ResendEmailCodeCommand> {
	constructor(
		protected readonly userRepository: UserRepository,
		protected readonly emailCodeRepository: EmailCodeRepository,
		protected readonly mailerAdapter: MailerAdapter
	) {}

	async execute({ dto: { email } }: ResendEmailCodeCommand): Promise<void> {
		const user: User = await this.userRepository.findOneByEmail({ email })
		if (!user) throw new NotFoundException('User not found')

		await this.emailCodeRepository.setAllUsed({ userId: user.id })

		const emailCode: EmailCode = await this.emailCodeRepository.createCode({
			userId: user.id
		})

		await this.mailerAdapter.sendMail({ email, code: emailCode.code })
	}
}
