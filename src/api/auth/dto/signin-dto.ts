import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
	@ApiProperty({ example: 'arash' })
	@IsNotEmpty()
	username: string;

	@ApiProperty({ example: 'password12345' })
	@IsNotEmpty()
	password: string;
}
