export class FindOneTokenForUserQuery {
	constructor(public readonly dto: { userId: string; tokenId: string }) {}
}
