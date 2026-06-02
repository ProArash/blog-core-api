// src/api/auth/auth.controller.ts

import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '@/utils/user.payload';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private configService: ConfigService,
	) {}

	@Post('sign-in')
	async signIn(
		@Body(new ValidationPipe()) signInDto: SignInDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const tokens = await this.authService.signIn(signInDto);
		const isLocal = this.configService.get<string>('ENV') === 'dev';
		const domain = isLocal
			? 'localhost'
			: (this.configService.get<string>('DOMAIN') ?? '');

		res.cookie('access_token', tokens.access_token, {
			path: '/',
			domain,
			httpOnly: true,
			secure: !isLocal,
		});

		res.cookie('refresh_token', tokens.refresh_token, {
			path: '/',
			domain,
			httpOnly: true,
			secure: !isLocal,
			maxAge: 1000 * 60 * 60 * 24 * 90,
		});

		return { message: 'Logged in.' };
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	async getProfile(@Req() req: Request) {
		const { id } = req.user as UserPayload;
		return await this.authService.getCurrentUser(id);
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('log-out')
	logOut(@Res({ passthrough: true }) res: Response) {
		const isLocal = this.configService.get<string>('ENV') === 'dev';
		const domain = isLocal
			? 'localhost'
			: (this.configService.get<string>('DOMAIN') ?? '');

		res.clearCookie('access_token', { path: '/', domain });
		res.clearCookie('refresh_token', { path: '/', domain });

		return { message: 'Logged out successfully' };
	}
}
