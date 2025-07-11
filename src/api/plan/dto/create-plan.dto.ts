import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
	@IsNotEmpty({ message: 'نام پلن اجباری است' })
	name: string;

	@IsNotEmpty({ message: 'قیمت اجباری است' })
	price: number;

	@IsNotEmpty({ message: 'محتوای context اجباری است' })
	context: IBasicBody[];

	@IsNotEmpty({ message: 'وضعیت پلن اجباری است' })
	status: boolean;

	@IsNotEmpty({ message: 'ویژگی ها اجباری است' })
	features: IBasicBody[];
}

export interface IBasicBody {
	title: string;
}
