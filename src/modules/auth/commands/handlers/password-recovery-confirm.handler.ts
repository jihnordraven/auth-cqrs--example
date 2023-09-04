import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PasswordRecoveryConfirmCommand } from '../impl'
import { PasswordCode } from '@prisma/client'
import { PasswordCodeRepository } from 'src/modules/password-code/password-code.repository'
import { ForbiddenException } from '@nestjs/common'
import { UserRepository } from 'src/modules/user/user.repository'
import { BcryptAdapter } from 'src/adapters'

@CommandHandler(PasswordRecoveryConfirmCommand)
export class PasswordRecoveryConfirmHandler
	implements ICommandHandler<PasswordRecoveryConfirmCommand>
{
	constructor(
		protected readonly passwordCodeRepository: PasswordCodeRepository,
		protected readonly userRepository: UserRepository,
		protected readonly bcryptAdapter: BcryptAdapter
	) {}

	async execute({
		dto: { code, newPassword }
	}: PasswordRecoveryConfirmCommand): Promise<void> {
		const passwordCode: PasswordCode | null = await this.passwordCodeRepository.findByCode(
			{ code }
		)
		if (!passwordCode) throw new ForbiddenException('Invalid password code')

		const isCodeExpired: boolean = Boolean(new Date(passwordCode.exp) < new Date())
		if (isCodeExpired) throw new ForbiddenException('Code expired')

		await this.passwordCodeRepository.setIsUsed({ codeId: passwordCode.id })

		const hashPassword: string = await this.bcryptAdapter.hash({ password: newPassword })

		await this.userRepository.newPassword({ userId: passwordCode.userId, hashPassword })
	}
}
