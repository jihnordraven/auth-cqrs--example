export class PasswordRecoveryConfirmCommand {
	constructor(public readonly dto: { code: string; newPassword: string }) {}
}
