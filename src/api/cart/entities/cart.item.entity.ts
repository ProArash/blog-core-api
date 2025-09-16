import { Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { Cart, ICart } from './cart.entity';
import { IProduct, Product } from '../../product/entities/product.entity';

export interface ICartItem {
	id: number;
	cart: ICart;
	product: IProduct;
}

@Entity()
export class CartItem extends FixedEntity {
	@ManyToOne(() => Cart, (cart) => cart.cartItems)
	cart: ICart;

	@ManyToOne(() => Product, (product) => product.cartItem, {
		onDelete: 'CASCADE',
		eager: true,
	})
	product: IProduct;
}
