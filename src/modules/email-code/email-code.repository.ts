import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EmailCode } from '@prisma/client'
import { v4 } from 'uuid'
import { add } from 'date-fns'

@Injectable()
export class EmailCodeRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createCode({ userId }: { userId: string }): Promise<EmailCode> {
		return this.prisma.emailCode.create({
			data: {
				code: v4(),
				exp: add(new Date(), { days: 7 }),
				userId
			}
		})
	}

	async findOne({ code }: { code: string }): Promise<EmailCode> {
		return this.prisma.emailCode.findUnique({ where: { code } })
	}

	async delete({ code }: { code: string }): Promise<boolean> {
		return Boolean(
			await this.prisma.emailCode.delete({
				where: { code }
			})
		)
	}

	async setAllUsed({ userId }: { userId: string }): Promise<void> {
		await this.prisma.emailCode.updateMany({
			where: { userId },
			data: { isUsed: true }
		})
	}

	async setUsed({ codeId }: { codeId: string }): Promise<void> {
		await this.prisma.emailCode.update({
			where: { id: codeId },
			data: { isUsed: true }
		})
	}
}
