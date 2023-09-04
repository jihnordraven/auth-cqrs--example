import { Module } from '@nestjs/common'
import { EmailCodeService } from './email-code.service'
import { EmailCodeController } from './email-code.controller'
import { EmailCodeRepository } from './email-code.repository'

@Module({
	controllers: [EmailCodeController],
	providers: [EmailCodeService, EmailCodeRepository],
	exports: [EmailCodeRepository]
})
export class EmailCodeModule {}
