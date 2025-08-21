import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
	@ApiProperty({ example: '09392414124' })
	@IsNotEmpty()
	mobile: string;

	@ApiProperty({ example: 'password12345' })
	@IsNotEmpty()
	password: string;

	@ApiProperty({ example: 'Morty Smith' })
	@IsNotEmpty()
	name: string;
}
