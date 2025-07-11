import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
	@IsNotEmpty({ message: 'نام پلن اجباری است' })
	name: string;
	@IsNotEmpty({ message: 'توضیحات پلن اجباری است' })
	caption: string;

	@IsNotEmpty({ message: 'قیمت اجباری است' })
	price: number;

	@IsNotEmpty({ message: 'محتوای context اجباری است' })
	context: string[];

	@IsNotEmpty({ message: 'وضعیت پلن اجباری است' })
	status: boolean;

	@IsNotEmpty({ message: 'ویژگی ها اجباری است' })
	features: string[];
}
