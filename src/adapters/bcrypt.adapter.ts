import { compare, hash } from 'bcrypt'
import { BcryptAdapterImpl } from './impl'

export class BcryptAdapter implements BcryptAdapterImpl {
	async hash({ password }: { password: string }): Promise<string> {
		return hash(password, 8)
	}

	async compare({
		password,
		hashPassword
	}: {
		password: string
		hashPassword: string
	}): Promise<boolean> {
		return compare(password, hashPassword)
	}
}
