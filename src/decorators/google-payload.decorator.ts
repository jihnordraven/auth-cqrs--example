import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'
import { IGoogleUser } from 'src/protection/strategies'

export const GooglePayloadDecorator = createParamDecorator(
	(key: keyof IGoogleUser, ctx: ExecutionContext): string => {
		const req: Request = ctx.switchToHttp().getRequest()
		return key ? req.user[key] : req.user
	}
)
