import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	productId: number;
}
