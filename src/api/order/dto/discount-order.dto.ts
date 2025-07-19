import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ApplyOrderDiscountDto {
	@ApiProperty()
	@IsNotEmpty()
	discountCode: string;

	@IsNotEmpty()
	planId: number;
}
