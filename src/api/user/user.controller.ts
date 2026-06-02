import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Delete,
	UseGuards,
	ValidationPipe,
	Req,
	Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/api/auth/roles.guard';
import { UserRole } from './entities/user.entity';
import type { Request } from 'express';
import { UserPayload } from '@/utils/user.payload';
import { Roles } from '@/api/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Roles(UserRole.USER)
	@Get('profile')
	async getProfile(@Req() req: Request) {
		const { id: userId } = req.user as UserPayload;
		return await this.userService.getProfile(userId);
	}

	@Roles(UserRole.ADMIN)
	@Post('newUser')
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.newUser(createUserDto);
	}

	@Roles(UserRole.ADMIN)
	@Get('getAllUsers')
	findAll(@Query('pageNumber') pageNumber: string) {
		return this.userService.getAllUsers(+pageNumber);
	}

	@Roles(UserRole.ADMIN)
	@Get('getUserById')
	findOne(@Query('userId') userId: string) {
		return this.userService.getUserById(+userId);
	}

	@Roles(UserRole.ADMIN)
	@Patch('updateUserById')
	update(
		@Query('userId') userId: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.updateUserById(+userId, updateUserDto);
	}

	@Roles(UserRole.ADMIN)
	@Delete('deleteUserById')
	remove(@Query('userId') userId: string) {
		return this.userService.removeUserById(+userId);
	}

	@Roles(UserRole.USER)
	@Patch('editProfile')
	async updateCurrentProfile(
		@Body(new ValidationPipe()) userDto: UpdateUserDto,
		@Req() req: Request,
	) {
		const user = req.user as UserPayload;
		return await this.userService.updateCurrentUserById(user.id, userDto);
	}
}
