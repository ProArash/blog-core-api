import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddItemToCartDto {
	@IsNumber()
	@IsNotEmpty()
	productId: number;
}
