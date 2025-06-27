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
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';
import { AuthResponse } from './auth.response';
import { Request, Response } from 'express';
import { UserPayload } from './user.payload';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	getCurrentProfile(@Req() req: Request) {
		const user: UserPayload = req.user as UserPayload;
		console.log(user.id);
		if (user.id) return this.authService.getUserById(user.id);
		return { message: 'Something went wrong.' };
	}

	@Post('signIn')
	async signIn(
		@Body(new ValidationPipe()) authDto: AuthDto,
		@Res() res: Response,
	) {
		const tokens: AuthResponse = await this.authService.signIn(authDto);

		res.cookie('access_token', tokens.access_token, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			secure: process.env.ENV == 'dev' ? false : true,
		});

		res.cookie('refresh_token', tokens.refresh_token, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			secure: process.env.ENV == 'dev' ? false : true,
		});
		res.status(200).json({
			message: 'success',
		});
	}

	@Post('register')
	async register(@Body(new ValidationPipe()) authDto: AuthDto) {
		return await this.authService.newUser(authDto);
	}
}
