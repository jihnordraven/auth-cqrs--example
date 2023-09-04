import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User } from '@prisma/client'
import { Request } from 'express'

export const LocalPayloadDecorator = createParamDecorator(
	(key: keyof User, ctx: ExecutionContext): Promise<User | keyof User> => {
		const req: Request = ctx.switchToHttp().getRequest()
		return key ? req.user[key] : req.user
	}
)
