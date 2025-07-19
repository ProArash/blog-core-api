import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';
import { UserRoles } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiProperty()
	@IsNotEmpty()
	name?: string | undefined;

	@ApiProperty()
	@IsNotEmpty()
	roles?: UserRoles[] | undefined;
}
