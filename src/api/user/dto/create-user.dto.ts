import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	mobile: string;

	@ApiProperty()
	@IsNotEmpty()
	password: string;

	@ApiProperty({ example: [UserRole.ADMIN, UserRole.USER] })
	@IsNotEmpty()
	roles: UserRole[];
}
