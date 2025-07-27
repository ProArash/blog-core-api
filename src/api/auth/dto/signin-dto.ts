import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
	@ApiProperty({ example: '09392414124' })
	@IsNotEmpty({ message: 'موبایل اجباری است' })
	mobile: string;

	@ApiProperty({ example: 'password' })
	@IsNotEmpty({ message: 'رمز عبور اجباری است' })
	password: string;
}
