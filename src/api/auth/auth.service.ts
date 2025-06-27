import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.model';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './user.payload';
import { AuthResponse } from './auth.response';
import { UserRole } from '../utils/roles';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectRepository(User)
		private userRepo: Repository<User>,
	) {}

	async newUser(authDto: AuthDto): Promise<User> {
		const users = await this.userRepo.find();
		const user = await this.userRepo.findOne({
			where: {
				username: authDto.username,
			},
		});
		if (user) throw new BadRequestException('Duplicate username.');
		const hashPwd = await bcrypt.hash(authDto.password, 10);
		return await this.userRepo
			.create({
				...authDto,
				password: hashPwd,
				roles:
					users.length == 0 ? [UserRole.ADMIN, UserRole.USER] : [UserRole.USER],
			})
			.save();
	}

	async getUserById(userId: number): Promise<User> {
		const user = await this.userRepo.findOne({
			where: {
				id: userId,
			},
		});
		console.log(user);

		if (!user) throw new BadRequestException('User not found.');
		return user;
	}

	async signIn(authDto: AuthDto): Promise<AuthResponse> {
		const user = await this.userRepo.findOne({
			where: {
				username: authDto.username,
			},
			select: ['id', 'username', 'password', 'roles'],
		});
		if (!user) throw new BadRequestException('Username not found.');

		const authResult = await bcrypt.compare(authDto.password, user.password);

		if (!authResult) throw new BadRequestException('Invalid password.');

		const payload: UserPayload = {
			id: user.id,
			roles: user.roles,
			username: user.username,
		};
		console.log(payload);

		return {
			access_token: await this.jwtService.signAsync(payload),
			refresh_token: await this.generateRt(payload),
		};
	}

	async generateRt(payload: UserPayload): Promise<string> {
		return await this.jwtService.signAsync(payload, { expiresIn: '1h' });
	}
}
