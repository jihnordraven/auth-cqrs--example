export class ValidateUserQuery {
	constructor(public readonly dto: { email: string; password: string }) {}
}
