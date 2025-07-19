import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRoles } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../../utils/user.payload';
import * as bcrypt from 'bcryptjs';

export interface IAuthResponse {
	access_token: string;
	refresh_token: string;
}

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepo: Repository<UserEntity>,
		private jwtService: JwtService,
	) {}

	async signIn(createDto: CreateAuthDto): Promise<IAuthResponse> {
		const users = await this.userRepo.find();
		let user = await this.userRepo.findOne({
			where: {
				mobile: createDto.mobile,
			},
			select: {
				id: true,
				mobile: true,
				password: true,
				name: true,
				roles: true,
			},
		});
		if (!user) {
			user = await this.userRepo
				.create({
					...createDto,
					roles:
						users.length == 0
							? [UserRoles.ADMIN, UserRoles.USER]
							: [UserRoles.USER],
					password: await bcrypt.hash(createDto.password, 10),
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
		} else {
			const result = await bcrypt.compare(createDto.password, user.password);
			if (!result) throw new BadRequestException('رمز وارد شده اشتباه است');
		}
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
		if (!user) throw new NotFoundException('کاربر یافت نشد');
		return user;
	}

	async generateRefreshToken(payload: UserPayload): Promise<string> {
		return await this.jwtService.signAsync(payload, { expiresIn: '90d' });
	}
}
