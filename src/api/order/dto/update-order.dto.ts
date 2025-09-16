import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto {
	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	orderId: number;

	@ApiProperty({
		enum: OrderStatus,
		example: OrderStatus.PENDING,
	})
	@IsNotEmpty()
	status: OrderStatus;
}
