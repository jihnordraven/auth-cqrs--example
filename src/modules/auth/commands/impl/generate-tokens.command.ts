export class GenerateTokensCommand {
	constructor(public readonly dto: { userId: string; userAgent: string; userIp: string }) {}
}
