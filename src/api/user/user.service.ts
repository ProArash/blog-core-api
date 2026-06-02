import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepo: Repository<User>,
	) {}
	async newUser(createUserDto: CreateUserDto) {
		const user = await this.userRepo.findOne({
			where: {
				username: createUserDto.mobile,
			},
		});
		if (user) throw new ConflictException('این شماره موبایل قبلا ثبت شده است');
		return await this.userRepo
			.create({
				username: createUserDto.mobile,
				name: createUserDto.name,
				password: await hash(createUserDto.password, 10),
				plainPassword: createUserDto.password,
				roles: [UserRole.USER],
			})
			.save();
	}

	async createAdmin(mobile: string, password: string) {
		const users = await this.userRepo.find();
		if (!users || users.length == 0)
			return await this.userRepo
				.create({
					username: mobile,
					password: await hash(password, 10),
					plainPassword: password,
					roles: [UserRole.ADMIN, UserRole.USER],
				})
				.save();
	}

	async getAllUsers(pageNumber: number) {
		const limit = 20;
		const skip = (pageNumber - 1) * limit;
		return await this.userRepo.find({
			take: limit,
			skip,
		});
	}

	async getUserById(userId: number) {
		const user = await this.userRepo.findOne({
			where: {
				id: userId,
			},
		});
		if (!user) throw new NotFoundException('کاربر یافت نشد');
		return user;
	}

	async getUserByMobile(username: string) {
		const user = await this.userRepo.findOne({
			where: {
				username,
			},
			select: {
				id: true,
				name: true,
				password: true,
				roles: true,
				username: true,
			},
		});
		if (!user) throw new NotFoundException('کاربر یافت نشد');
		return user;
	}

	async updateUserById(userId: number, updateUserDto: UpdateUserDto) {
		return await this.userRepo.update(userId, { ...updateUserDto });
	}

	async getProfile(userId: number) {
		return await this.userRepo.findOne({
			where: { id: userId },
		});
	}

	async updateCurrentUserById(userId: number, updateUserDto: UpdateUserDto) {
		delete updateUserDto.password;
		return await this.userRepo.update(userId, {
			...updateUserDto,
		});
	}

	async removeUserById(userId: number) {
		return await this.userRepo.delete(userId);
	}
}
