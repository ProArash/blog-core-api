import { IsNotEmpty } from 'class-validator';

export class CheckDiscountCodeDto {
	@IsNotEmpty()
	discountCode: string;

	@IsNotEmpty()
	planId: number;
}
