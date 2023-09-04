import { Logger } from '@nestjs/common'
import { EmailStatusEnum, PrismaClient, RolesEnum } from '@prisma/client'
import { red, yellow } from 'colorette'

const prisma: PrismaClient = new PrismaClient()

// tables
const ROLES = [RolesEnum.USER, RolesEnum.ADMIN, RolesEnum.DEVELOPER]

const EMAIL_STATUSES = [EmailStatusEnum.PENDING, EmailStatusEnum.CONFIRMED]
// tables

const logger: Logger = new Logger('seed database')

const main = async (): Promise<void> => {
	for (const role of ROLES) {
		await prisma.role.upsert({
			where: { name: role },
			update: { name: role },
			create: { name: role }
		})
	}

	for (const emailStatus of EMAIL_STATUSES) {
		await prisma.emailStatus.upsert({
			where: { name: emailStatus },
			update: { name: emailStatus },
			create: { name: emailStatus }
		})
	}
}

main()
	.then(() => logger.log(yellow('Database was seeded successfully')))
	.catch((err: unknown) =>
		logger.error(red(`Unable to seed the database. Learn more at: ${err}`))
	)
