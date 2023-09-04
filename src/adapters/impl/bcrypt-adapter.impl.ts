export class BcryptAdapterImpl {
	public async hash({ password }: { password: string }): Promise<string> {
		return 'hash'
	}

	public async compare({
		password,
		hashPassword
	}: {
		password: string
		hashPassword: string
	}): Promise<boolean> {
		return true
	}
}
