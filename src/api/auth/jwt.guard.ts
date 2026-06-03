import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../../utils/user.payload';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from '@/api/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					const cookies = req.cookies as AuthResponse;
					return cookies?.access_token || null;
				},
			]),
			secretOrKey: configService.get<string>('SECRET', 'secret'),
			passReqToCallback: true,
			ignoreExpiration: true,
		});
	}

	async validate(req: Request, payload: UserPayload): Promise<UserPayload> {
		const cookies = req.cookies as AuthResponse;
		const isLocal = this.configService.get<string>('ENV') === 'dev';
		const domain = isLocal
			? 'localhost'
			: (this.configService.get<string>('DOMAIN') ?? '');

		try {
			await this.jwtService.verifyAsync(cookies.access_token);
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				if (!cookies.refresh_token) {
					throw new UnauthorizedException('Access token expired');
				}

				try {
					await this.jwtService.verifyAsync(cookies.refresh_token);
				} catch (refreshError) {
					if (refreshError instanceof TokenExpiredError) {
						throw new UnauthorizedException('Refresh token expired');
					}
					throw new UnauthorizedException('Invalid refresh token');
				}

				const newPayload: UserPayload = {
					id: payload.id,
					name: payload.name,
					mobile: payload.mobile,
					roles: payload.roles,
				};

				const newAccessToken = await this.jwtService.signAsync(newPayload);

				req.res?.cookie('access_token', newAccessToken, {
					path: '/',
					domain,
					httpOnly: true,
					secure: !isLocal,
				});

				return newPayload;
			}
			throw new UnauthorizedException('Invalid access token');
		}

		return {
			id: payload.id,
			name: payload.name,
			mobile: payload.mobile,
			roles: payload.roles,
		};
	}
}
