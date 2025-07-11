import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
	@IsNotEmpty({ message: 'موبایل اجباری است' })
	mobile: string;

	@IsNotEmpty({ message: 'رمز عبور اجباری است' })
	password: string;
}
