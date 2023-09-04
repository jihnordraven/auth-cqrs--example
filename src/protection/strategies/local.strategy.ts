import { ValidateUserQuery } from '@modules/auth/queries/impl'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { Strategy } from 'passport-local'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly queryBus: QueryBus) {
		super({
			usernameField: 'email'
		})
	}

	async validate(email: string, password: string): Promise<User> {
		const user: User | null = await this.queryBus.execute(
			new ValidateUserQuery({ email, password })
		)
		if (!user) throw new UnauthorizedException('Invalid login or password')

		return user
	}
}
