import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateInquiryDto {
	@ApiProperty({ example: 'فروشگاهی' })
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 'توضیحات تستی' })
	@IsNotEmpty()
	description: string;

	@ApiProperty({ example: '09392414124' })
	@IsNotEmpty()
	mobile: string;

	@ApiProperty({ example: 'آرش قنبری' })
	@IsNotEmpty()
	fullName: string;

	@ApiProperty({ example: 'شیراز' })
	@IsNotEmpty()
	city: string;

	@ApiProperty({ example: 5 })
	@IsNotEmpty()
	deadLine: number;

	@ApiProperty({
		example: [
			{
				title: 'درگاه بانکی',
				value: 'زیبال',
			},
		],
	})
	@IsNotEmpty()
	attributes: AttributesDto[];
}

export class AttributesDto {
	@ApiProperty()
	title: string;

	@ApiProperty()
	value?: string;
}
