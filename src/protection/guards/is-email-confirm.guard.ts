import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { EmailStatusEnum, User } from '@prisma/client'
import { Request } from 'express'

@Injectable()
export class IsEmailConfirmGuard implements CanActivate {
	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const req: Request = ctx.switchToHttp().getRequest()

		// @ts-ignore
		const user: User = req.user

		if (user.emailStatusName !== EmailStatusEnum.CONFIRMED)
			throw new ForbiddenException('You have to confirm your email')

		return true
	}
}
