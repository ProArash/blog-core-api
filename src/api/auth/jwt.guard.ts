import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../utils/user.payload';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { IAuthResponse } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					const cookies: IAuthResponse = req.cookies as IAuthResponse;
					let token = '';
					if (cookies) token = cookies.refresh_token;
					return token;
				},
			]),
			secretOrKey: configService.get<string>('SECRET') || 'secret',
			passReqToCallback: true,
			ignoreExpiration: false,
		});
	}
	async validate(req: Request, payload: UserPayload): Promise<UserPayload> {
		const cookies = req.cookies as IAuthResponse;
		try {
			await this.jwtService.verifyAsync(cookies.access_token);
		} catch (error) {
			console.log(error);
			if (error instanceof TokenExpiredError) {
				const newPayload: UserPayload = {
					id: payload.id,
					name: payload.name,
					mobile: payload.mobile,
				};
				payload = newPayload;
				const accesToken = await this.jwtService.signAsync(newPayload);
				req.res?.cookie('access_token', accesToken, {
					httpOnly: true,
				});
			}
		}

		return payload;
	}
}
