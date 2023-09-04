import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { RolesEnum, User } from '@prisma/client'
import { Request } from 'express'

@Injectable()
export class AdminGuard implements CanActivate {
	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const req: Request = ctx.switchToHttp().getRequest()

		// @ts-ignore
		const user: User = req.user

		if (user.roleName !== RolesEnum.ADMIN)
			throw new ForbiddenException('You dont have enought right for this endpoint')

		return true
	}
}
