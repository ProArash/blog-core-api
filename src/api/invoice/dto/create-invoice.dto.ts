import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateInvoiceDto {
	@ApiProperty({ example: 0 })
	@IsNotEmpty()
	userId: number;

	@ApiProperty({ example: 0 })
	@IsNotEmpty()
	planId: number;
}
