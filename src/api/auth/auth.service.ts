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
import { User, UserRole } from '../user/entities/user.entity';

export interface IAuthResponse {
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
	) {}

	async signIn(createDto: SignInDto): Promise<IAuthResponse> {
		const user = await this.userService.getUserByMobile(createDto.mobile);
		const result = await bcryptjs.compare(createDto.password, user.password);
		if (!result) throw new BadRequestException('رمز نامعتبر.');

		const payload: UserPayload = {
			id: user.id,
			name: user.name,
			mobile: user.mobile,
			roles: user.roles,
		};

		return {
			access_token: await this.jwtService.signAsync(payload),
			refresh_token: await this.generateRefreshToken(payload),
		};
	}

	async registerUser(createDto: SignInDto): Promise<IAuthResponse> {
		const user = await this.userService.newUser({
			mobile: createDto.mobile,
			name: createDto.name,
			password: createDto.password,
			roles: [UserRole.USER],
		});

		const payload: UserPayload = {
			id: user.id,
			name: user.name,
			mobile: user.mobile,
			roles: user.roles,
		};

		return {
			access_token: await this.jwtService.signAsync(payload),
			refresh_token: await this.generateRefreshToken(payload),
		};
	}

	async getCurrentUser(userId: number): Promise<User> {
		const user = await this.userRepo.findOne({
			where: {
				id: userId,
			},
		});
		if (!user) throw new NotFoundException('کاربر یافت نشد.');
		return user;
	}

	async generateRefreshToken(payload: UserPayload): Promise<string> {
		return await this.jwtService.signAsync(payload, { expiresIn: '90d' });
	}
}
