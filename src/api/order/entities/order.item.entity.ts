import { Column, Entity, ManyToOne } from 'typeorm';
import { IProduct, Product } from '../../product/entities/product.entity';
import { IOrder, Order } from './order.entity';
import { FixedEntity } from '../../../utils/entities/fixed.entity';

export interface IOrderItem {
	id: number;
	quantity: number;
	priceAtPurchase: number;
	product: IProduct;
	order: IOrder;
}

@Entity()
export class OrderItem extends FixedEntity {
	@Column()
	quantity: number;

	@Column('double')
	priceAtPurchase: number;

	@ManyToOne(() => Order, (order) => order.orderItems)
	order: IOrder;

	@ManyToOne(() => Product, (product) => product.orderItems)
	product: IProduct;
}
