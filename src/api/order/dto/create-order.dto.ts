import { IsNotEmpty } from 'class-validator';
import { IOrder, OrderStatus } from '../entities/order.entity';

export class CreateOrderDto implements Partial<IOrder> {
	@IsNotEmpty()
	status: OrderStatus;

	@IsNotEmpty()
	totalAmount: number;

	@IsNotEmpty()
	trackId: string;
}
