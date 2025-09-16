import { Column, Entity, OneToMany } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import {
	IProductAttribute,
	ProductAttribute,
} from './product.attributes.entity';
import { CartItem, ICartItem } from '../../cart/entities/cart.item.entity';
import { IOrderItem, OrderItem } from '../../order/entities/order.item.entity';

export enum ProductType {
	COURSE = 'course',
	FILE = 'file',
}

export interface IProduct {
	id: number;
	name: string;
	price: number;
	media_url: string;
	status: boolean;
	type: ProductType;
	productAttributes: IProductAttribute[];
	cartItem: ICartItem[];
}

@Entity()
export class Product extends FixedEntity {
	@Column()
	name: string;

	@Column('double')
	price: number;

	@Column({ nullable: true })
	mediaUrl: string;

	@Column()
	status: boolean;

	@Column()
	type: ProductType;

	@OneToMany(() => ProductAttribute, (attr) => attr.product, {
		cascade: true,
		eager: true,
	})
	attributes: IProductAttribute[];

	@OneToMany(() => CartItem, (cartItem) => cartItem.product)
	cartItem: ICartItem[];

	@OneToMany(() => OrderItem, (orderItem) => orderItem.product)
	orderItems: IOrderItem[];
}
