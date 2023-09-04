import { NestFactory } from '@nestjs/core'
import { INestApplication, Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import { blue, red } from 'colorette'

const bootstrap = async () => {
	const logger: Logger = new Logger(bootstrap.name)

	try {
		const app = await NestFactory.create<INestApplication>(AppModule)

		app.use(cookieParser())
		app.enableCors({ credentials: true })
		app.setGlobalPrefix('api')

		const configService = app.get(ConfigService) as ConfigService

		const PORT: number = configService.get<number>('PORT')
		const HOST: string = configService.get<string>('HOST')
		const STATUS: string = configService.get<string>('STATUS')

		app.listen(PORT)
		logger.log(blue(`Server is running on ${HOST}:${PORT} in status: ${STATUS}`))
	} catch (err: unknown) {
		logger.error(red(`Status starts with an error. Learn more at: ${err}`))
	}
}

bootstrap()
