export class PasswordRecoveryCommand {
	constructor(public readonly dto: { email: string }) {}
}
