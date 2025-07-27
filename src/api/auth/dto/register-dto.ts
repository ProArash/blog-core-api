import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'نام اجباری است' })
	name: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'موبایل اجباری است' })
	mobile: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'رمز عبور اجباری است' })
	password: string;
}
