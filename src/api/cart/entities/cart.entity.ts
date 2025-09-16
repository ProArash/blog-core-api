import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { IUser, User } from '../../user/entities/user.entity';
import { CartItem, ICartItem } from './cart.item.entity';

export interface ICart {
	id: number;
	user: IUser;
	cartItem: ICartItem[];
}

@Entity()
export class Cart extends FixedEntity {
	@OneToOne(() => User, (user) => user.cart)
	@JoinColumn()
	user: IUser;

	@OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
		cascade: true,
		eager: true,
	})
	cartItems: ICartItem[];
}
