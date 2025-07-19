import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDiscountDto } from './create-discount.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {
	@ApiProperty()
	@IsNotEmpty()
	discountCode?: string;

	@ApiProperty()
	@IsNotEmpty()
	discountPercent?: number;

	@ApiProperty()
	@IsNotEmpty()
	maxUse?: number;
}
