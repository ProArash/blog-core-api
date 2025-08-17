import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { SignInDto } from './dto/signin-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRoles } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../../utils/user.payload';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register-dto';
import { UserService } from '../user/user.service';

export interface IAuthResponse {
	access_token: string;
	refresh_token: string;
}

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepo: Repository<UserEntity>,
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	async register(registerDto: RegisterDto) {
		let user = await this.userRepo.findOne({
			where: {
				mobile: registerDto.mobile,
			},
		});
		if (user) throw new ConflictException('کاربر تکراری');
		user = await this.userRepo
			.create({
				...registerDto,
				roles: [UserRoles.USER],
				password: await bcrypt.hash(registerDto.password, 10),
				plainPassword: registerDto.password,
			})
			.save();
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

	async signIn(createDto: SignInDto): Promise<IAuthResponse> {
		const user = await this.userService.getUserByMobile(createDto.mobile);
		const result = await bcrypt.compare(createDto.password, user.password);
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

	async getCurrentUser(userId: number): Promise<UserEntity> {
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
