import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	cartId: number;
}
