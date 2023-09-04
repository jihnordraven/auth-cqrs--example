export class LocalRegisterCommand {
	constructor(
		public readonly dto: { username: string; email: string; password: string }
	) {}
}
