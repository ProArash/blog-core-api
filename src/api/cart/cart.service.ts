import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart.item.entity';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
	constructor(
		@InjectRepository(Cart)
		private cartRepo: Repository<Cart>,
		@InjectRepository(CartItem)
		private cartItemRepo: Repository<CartItem>,
		private userService: UserService,
		private productService: ProductService,
	) {}
	async getOrCreateCart(userId: number) {
		const cart = await this.cartRepo.findOne({
			where: {
				user: {
					id: userId,
				},
			},
		});
		if (cart) return cart;
		const user = await this.userService.getUserById(userId);
		return await this.cartRepo
			.create({
				user,
			})
			.save();
	}

	async getCart(userId: number) {
		const cart = await this.getOrCreateCart(userId);
		const total = cart.cartItems.reduce(
			(sum, item) => sum + item.product.price,
			0,
		);
		return {
			total,
			items: cart.cartItems,
		};
	}

	async addItemToCart(userId: number, productId: number) {
		const cart = await this.getOrCreateCart(userId);
		const isExist = cart.cartItems.some((v) => v.product.id == productId);
		if (isExist) throw new ConflictException('محصول در سبد خرید هست!');
		const product = await this.productService.getProductById(productId);
		await this.cartItemRepo
			.create({
				cart,
				product,
			})
			.save();
		return await this.getCart(userId);
	}

	async removeProductFromCart(userId: number, productId: number) {
		const cart = await this.getOrCreateCart(userId);
		await this.cartItemRepo.delete({
			cart: { id: cart.id },
			product: { id: productId },
		});
		return await this.getCart(userId);
	}

	async clearCart(cartId: number) {
		const cart = await this.cartRepo.findOne({
			where: { id: cartId },
		});
		if (!cart) throw new NotFoundException('سبد خرید یافت نشد.');
		return await this.cartItemRepo.delete({ cart: { id: cart.id } });
	}
}
