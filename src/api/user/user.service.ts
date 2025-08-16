import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepo: Repository<UserEntity>,
	) {}
	async newUser(createUserDto: CreateUserDto) {
		return await this.userRepo.create(createUserDto).save();
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
