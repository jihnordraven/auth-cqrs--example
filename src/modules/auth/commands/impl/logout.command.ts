export class LogoutCommand {
	constructor(public readonly dto: { userId: string; userAgent: string; userIp: string }) {}
}
