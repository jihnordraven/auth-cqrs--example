import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const CookieDecorator = createParamDecorator(
	(key: string, ctx: ExecutionContext): Promise<string | object> => {
		const req: Request = ctx.switchToHttp().getRequest()
		return key ? req.cookies[key] : req.cookies
	}
)
