import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'نام پلن اجباری است' })
	name: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'توضیحات پلن اجباری است' })
	caption: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'قیمت اجباری است' })
	price: number;

	@ApiProperty()
	@IsArray({ each: true })
	@IsNotEmpty({ message: 'محتوای context اجباری است' })
	context: string[];

	@ApiProperty()
	@IsNotEmpty({ message: 'وضعیت پلن اجباری است' })
	status: boolean;

	@ApiProperty()
	@IsArray({ each: true })
	@IsNotEmpty({ message: 'ویژگی ها اجباری است' })
	features: string[];
}

export interface FeatureDto {
	title: string;
}
