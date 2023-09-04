import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RegisterConfirmCommand } from '../impl'
import { EmailCode } from '@prisma/client'
import { EmailCodeRepository } from 'src/modules/email-code/email-code.repository'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { UserRepository } from 'src/modules/user/user.repository'

@CommandHandler(RegisterConfirmCommand)
export class RegisterConfirmHandler implements ICommandHandler<RegisterConfirmCommand> {
	constructor(
		protected readonly emailCodeRepository: EmailCodeRepository,
		protected readonly userRepository: UserRepository
	) {}

	async execute({ dto: { code } }: RegisterConfirmCommand): Promise<void> {
		const emailCode: EmailCode = await this.emailCodeRepository.findOne({ code })
		if (!emailCode) throw new NotFoundException('Email code not found')

		const isCodeExpired: boolean = Boolean(new Date(emailCode.exp) < new Date())
		if (isCodeExpired) throw new ForbiddenException('Email code expired')

		await this.userRepository.emailConfirm({ userId: emailCode.userId })
	}
}
