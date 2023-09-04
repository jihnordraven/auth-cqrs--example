import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PasswordCode } from '@prisma/client'
import { v4 } from 'uuid'
import { add } from 'date-fns'

@Injectable()
export class PasswordCodeRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create({ userId }: { userId: string }): Promise<PasswordCode> {
		return this.prisma.passwordCode.create({
			data: {
				code: v4(),
				exp: add(new Date(), { minutes: 10 }),
				userId
			}
		})
	}

	async findByCode({ code }: { code: string }): Promise<PasswordCode | null> {
		return this.prisma.passwordCode.findUnique({ where: { code } })
	}

	async findByCodeId({ codeId }: { codeId: string }): Promise<PasswordCode | null> {
		return this.prisma.passwordCode.findUnique({ where: { id: codeId } })
	}

	async setIsUsed({ codeId }: { codeId: string }): Promise<void> {
		await this.prisma.passwordCode.update({
			where: { id: codeId },
			data: { isUsed: true }
		})
	}
}
