export class DeleteManyTokensForUserCommand {
	constructor(public readonly dto: { userId: string }) {}
}
