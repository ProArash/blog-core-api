import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { Cart, ICart } from '../../cart/entities/cart.entity';
import { IOrder, Order } from '../../order/entities/order.entity';

export enum UserRole {
	ADMIN = 'Admin',
	USER = 'User',
}

export interface IUser {
	id: number;
	name: string;
	mobile: string;
	password: string;
	plainPassword: string;
	roles: UserRole[];
	cart: ICart;
}

@Entity()
export class User extends FixedEntity {
	@Column({
		nullable: true,
	})
	name: string;

	@Column({
		unique: true,
	})
	mobile: string;

	@Column({
		select: false,
	})
	password: string;

	@Column({
		select: false,
	})
	plainPassword: string;

	@OneToOne(() => Cart, (cart) => cart.user)
	cart: ICart;

	@OneToMany(() => Order, (order) => order.user)
	orders: IOrder[];

	@Column('simple-array')
	roles: UserRole[];
}
