import { IGoogleUser } from 'src/protection/strategies'

export class GoogleRegisterCommand {
	constructor(public readonly dto: IGoogleUser) {}
}
