import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRoles } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepo: Repository<UserEntity>,
	) {}
	async newUser(createUserDto: CreateUserDto) {
		return await this.userRepo.create(createUserDto).save();
	}

	async createAdmin(mobile: string, password: string) {
		const users = await this.userRepo.find();
		if (!users || users.length == 0)
			return await this.userRepo
				.create({
					mobile,
					password: await hash(password, 10),
					plainPassword: password,
					roles: [UserRoles.ADMIN, UserRoles.USER, UserRoles.ROOT],
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

	async getUserByMobile(mobile: string) {
		const user = await this.userRepo.findOne({
			where: {
				mobile,
			},
			select: {
				id: true,
				name: true,
				password: true,
				roles: true,
				mobile: true,
			},
		});
		if (!user) throw new NotFoundException('کاربر یافت نشد');
		return user;
	}

	async updateUserById(userId: number, updateUserDto: UpdateUserDto) {
		return await this.userRepo.update(userId, { ...updateUserDto });
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
