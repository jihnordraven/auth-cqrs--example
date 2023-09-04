export class ResendEmailCodeCommand {
	constructor(public readonly dto: { email: string }) {}
}
