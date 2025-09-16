import { IsNotEmpty } from 'class-validator';
import { ProductType } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IProductAttribute } from '../entities/product.attributes.entity';

export class CreateProductDto {
	@ApiProperty({ example: 'NextJS course' })
	@IsNotEmpty()
	name: string;

	@ApiProperty({ example: 2500000 })
	@IsNotEmpty()
	price: number;

	@ApiProperty({ example: true })
	@IsNotEmpty()
	status: boolean;

	@ApiProperty({ enum: ProductType, example: ProductType.COURSE })
	@IsNotEmpty()
	type: ProductType;

	@ApiProperty({
		example: [
			{
				key: 'FileSize',
				value: '25Mb',
			},
		],
	})
	@IsNotEmpty()
	attributes: IProductAttribute[];
}
