import { IsNotEmpty } from 'class-validator';

export class AuthDto {
	@IsNotEmpty({ message: 'نام کاربری/موبایل حداقل 3 کاراکتر است.' })
	username: string;

	@IsNotEmpty({ message: 'رمز ورود باید حداقل 6 کاراکتر باشد.' })
	password: string;
}
