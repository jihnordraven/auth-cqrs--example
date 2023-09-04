import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'

export interface IGoogleUser {
	readonly providerId: string
	readonly email: string
	readonly username: string
	readonly firstName: string
	readonly lastName: string
	readonly displayName: string
	readonly photo: string
	readonly provider: string
	readonly accessToken: string
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			clientID:
				'1014708802892-aj3ddr6bhhjp9on2rdjhf91r8fab04g9.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: 'http://localhost:4200/api/auth/google/callback',
			scope: ['profile', 'email']
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: any
	): Promise<void> {
		try {
			const user: IGoogleUser = {
				providerId: profile.id,
				email: profile.emails[0].value,
				username: profile.username,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				photo: profile.photos[0].value,
				provider: profile.provider,
				accessToken
			}
			done(null, user)
		} catch (err: unknown) {
			done(err)
		}
	}
}
