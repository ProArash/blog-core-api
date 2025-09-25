import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { IOrderItem, OrderItem } from './order.item.entity';
import { IUser, User } from '../../user/entities/user.entity';

export enum OrderStatus {
	PENDING = 'pending',
	PAID = 'paid',
	CANCELLED = 'cancelled',
	FAILED = 'failed',
}

export interface IOrder {
	id: number;
	status: OrderStatus;
	totalAmount: number;
	trackId: string;
	user: IUser;
	orderItems: IOrderItem[];
}

@Entity()
export class Order extends FixedEntity {
	@Column({
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.PENDING,
	})
	status: OrderStatus;

	@Column('double')
	totalAmount: number;

	@Column({ nullable: true })
	trackId: string;

	@ManyToOne(() => User, (user) => user.orders)
	user: IUser;

	@OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
		cascade: true,
		eager: true,
	})
	orderItems: IOrderItem[];
}
