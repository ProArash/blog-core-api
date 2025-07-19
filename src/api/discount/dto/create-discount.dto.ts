import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDiscountDto {
	@ApiProperty()
	@IsNotEmpty()
	discountCode: string;

	@ApiProperty()
	@IsNotEmpty()
	discountPercent: number;

	@ApiProperty()
	@IsNotEmpty()
	maxUse: number;
}
