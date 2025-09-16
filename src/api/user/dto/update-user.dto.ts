import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiProperty()
	@IsNotEmpty()
	name?: string | undefined;

	@ApiProperty()
	@IsNotEmpty()
	roles?: UserRole[] | undefined;
}
