import { Module } from '@nestjs/common'
import { PasswordCodeService } from './password-code.service'
import { PasswordCodeController } from './password-code.controller'
import { PasswordCodeRepository } from './password-code.repository'

@Module({
	controllers: [PasswordCodeController],
	providers: [PasswordCodeService, PasswordCodeRepository],
	exports: [PasswordCodeRepository]
})
export class PasswordCodeModule {}
