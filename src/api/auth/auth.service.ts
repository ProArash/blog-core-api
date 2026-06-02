// src/api/auth/auth.service.ts

import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { SignInDto } from './dto/signin-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../../utils/user.payload';
import { UserService } from '../user/user.service';
import * as bcryptjs from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

export interface AuthResponse {
	access_token: string;
	refresh_token: string;
}

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private userRepo: Repository<User>,
		private userService: UserService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	async signIn(createDto: SignInDto): Promise<AuthResponse> {
		const user = await this.userService.getUserByMobile(createDto.username);
		const result = await bcryptjs.compare(createDto.password, user.password);
		if (!result) throw new BadRequestException('Invalid password.');

		const payload: UserPayload = {
			id: user.id,
			name: user.name,
			mobile: user.username,
			roles: user.roles,
		};

		return this.generateTokens(payload);
	}

	async getCurrentUser(userId: number): Promise<User> {
		const user = await this.userRepo.findOne({
			where: { id: userId },
		});
		if (!user) throw new NotFoundException('User not found.');
		return user;
	}

	async generateTokens(payload: UserPayload): Promise<AuthResponse> {
		const [access_token, refresh_token] = await Promise.all([
			this.jwtService.signAsync(payload, {
				expiresIn: '15m',
			}),
			this.jwtService.signAsync(payload, {
				expiresIn: '2h',
			}),
		]);

		return { access_token, refresh_token };
	}

	async refreshTokens(refreshToken: string): Promise<AuthResponse> {
		const payload =
			await this.jwtService.verifyAsync<UserPayload>(refreshToken);

		const newPayload: UserPayload = {
			id: payload.id,
			name: payload.name,
			mobile: payload.mobile,
			roles: payload.roles,
		};

		return this.generateTokens(newPayload);
	}
}
