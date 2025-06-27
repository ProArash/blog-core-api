import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from './user.payload';
import { Request, Response } from 'express';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthResponse } from './auth.response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private jwtService: JwtService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					const cookies: AuthResponse = req.cookies as AuthResponse;
					let at = '';
					if (cookies) at = cookies.access_token;
					return at;
				},
			]),
			ignoreExpiration: true,
			secretOrKey: process.env.SECRET || 'secret',
			passReqToCallback: true,
		});
	}
	async validate(
		req: Request,
		res: Response,
		payload: UserPayload,
	): Promise<UserPayload> {
		const cookies: AuthResponse = req.cookies as AuthResponse;
		const aT = cookies.access_token;
		if (aT) {
			try {
				await this.jwtService.verifyAsync(aT);
			} catch (error) {
				if (error instanceof TokenExpiredError) {
					const rt = cookies.refresh_token;
					try {
						await this.jwtService.verifyAsync(rt);
						const newAt: string = await this.jwtService.signAsync(payload);
						req.res?.setHeader('access_token', newAt);
					} catch (error) {
						if (error instanceof TokenExpiredError)
							throw new UnauthorizedException('refresh token is expired.');
						else {
							throw new UnauthorizedException(error);
						}
					}
				} else {
					throw new UnauthorizedException('Invalid token.');
				}
			}
		}
		console.log('strategy ',payload.id);

		return payload;
	}
}
