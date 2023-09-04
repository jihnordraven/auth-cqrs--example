import { ConfigService } from '@nestjs/config'
import { SendMailOptions, Transporter, createTransport } from 'nodemailer'
import { MailerAdapterImpl } from './impl'

export class MailerAdapter implements MailerAdapterImpl {
	constructor(private readonly configService: ConfigService) {}

	private async options(options: SendMailOptions): Promise<void> {
		const transport: Transporter = createTransport({
			service: 'gmail',
			auth: {
				user: 'jihnordraven@gmail.com',
				pass: 'htsubscpzoymrwce'
			}
		})
		await transport.sendMail(options)
	}

	async sendMail({ email, code }: { email: string; code: string }): Promise<void> {
		await this.options({
			to: email,
			from: 'jihnordraven@gmail.com',
			subject: 'Email confirmation',
			html: `<a href='http://localhost:4200/api/auth/register-confirm?code=${code}'>Register confirmation</a>`
		})
	}
}
