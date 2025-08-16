import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePortfolioDto {
	@ApiProperty({ example: 'Ecommerce' })
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 'https://arash.vip' })
	@IsNotEmpty()
	url: string;
}
