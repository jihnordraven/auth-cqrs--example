import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { TokenModule } from './modules/token/token.module'
import { PasswordCodeModule } from './modules/password-code/password-code.module'
import { EmailCodeModule } from './modules/email-code/email-code.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { GoogleStrategy, JwtStrategy, LocalStrategy } from '@strategies'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'

const strategies = [LocalStrategy, JwtStrategy, GoogleStrategy]

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		CacheModule.registerAsync({
			isGlobal: true,
			useFactory: async () => ({
				store: await redisStore({
					socket: {
						host: 'localhost',
						port: 6379
					}
				})
			})
		}),
		CqrsModule,
		AuthModule,
		UserModule,
		TokenModule,
		PasswordCodeModule,
		EmailCodeModule,
		PrismaModule
	],
	providers: [...strategies]
})
export class AppModule {}
