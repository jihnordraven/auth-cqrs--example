import { UserRepository } from 'src/modules/user/user.repository'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayloadType } from 'src/types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		protected readonly configService: ConfigService,
		protected readonly userRepository: UserRepository
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
			ignoreExpiration: configService.get<boolean>('JWT_IGNORE_EXPIRATION')
		})
	}

	async validate({ userId }: JwtPayloadType): Promise<User> {
		const user: User | null = await this.userRepository.findOneUserById({ userId })
		if (!user) throw new UnauthorizedException(`User doesn't exist`)

		return user
	}
}
