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
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '../../utils/user.payload';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private configService: ConfigService,
	) {}

	@Post('signIn')
	async signIn(
		@Body(new ValidationPipe()) signInDto: SignInDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const auth = await this.authService.signIn(signInDto);

		const isLocal = this.configService.get<string>('ENV') == 'dev';

		res.cookie('access_token', auth.access_token);
		res.cookie('refresh_token', auth.refresh_token, {
			path: '/',
			domain: isLocal
				? 'localhost'
				: (this.configService.get<string>('DOMAIN') ?? ''),
			httpOnly: true,
			secure: isLocal ? false : true,
			maxAge: 1000 * 60 * 60 * 24 * 90,
		});
		return {
			message: 'با موفقیت وارد شدید',
		};
	}

	@Post('registerUser')
	async registerUser(
		@Body(new ValidationPipe()) signInDto: SignInDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const auth = await this.authService.registerUser(signInDto);

		const isLocal = this.configService.get<string>('ENV') == 'dev';

		res.cookie('access_token', auth.access_token);
		res.cookie('refresh_token', auth.refresh_token, {
			path: '/',
			domain: isLocal
				? 'localhost'
				: (this.configService.get<string>('DOMAIN') ?? ''),
			httpOnly: true,
			secure: isLocal ? false : true,
			maxAge: 1000 * 60 * 60 * 24 * 90,
		});
		return {
			message: 'با موفقیت وارد شدید',
		};
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	async getProfile(@Req() req: Request) {
		const { id } = req.user as UserPayload;
		return await this.authService.getCurrentUser(id);
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('logOut')
	logOut(@Res({ passthrough: true }) res: Response) {
		const isLocal = this.configService.get<string>('ENV') == 'dev';
		res.clearCookie('refresh_token', {
			path: '/',
			domain: isLocal
				? 'localhost'
				: (this.configService.get<string>('DOMAIN') ?? ''),
		});
		res.clearCookie('access_token', {
			path: '/',
			domain: isLocal
				? 'localhost'
				: (this.configService.get<string>('DOMAIN') ?? ''),
		});
		return {
			message: 'با موفقیت خارج شدید',
		};
	}
}
