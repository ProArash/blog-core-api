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
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '../utils/user.payload';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private configService: ConfigService,
	) {}

	@Post('signIn')
	async signIn(
		@Body(new ValidationPipe()) createAuthDto: CreateAuthDto,
		@Res() res: Response,
	) {
		const auth = await this.authService.signIn(createAuthDto);

		const isLocal = this.configService.get<string>('ENV') == 'dev';

		res.cookie('access_token', auth.access_token);
		res.cookie('refresh_token', auth.refresh_token, {
			path: '/',
			domain: isLocal ? 'localhost' : 'arash.vip',
			httpOnly: true,
			secure: isLocal ? false : true,
			maxAge: 1000 * 60 * 60 * 24 * 90,
		});
		res.status(200).json({
			message: 'با موفقیت وارد شدید.',
		});
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	async getProfile(@Req() req: Request) {
		const { id } = req.user as UserPayload;
		return await this.authService.getCurrentUser(id!);
	}
}
