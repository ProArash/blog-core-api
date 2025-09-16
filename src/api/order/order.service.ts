import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order.item.entity';
import { UserService } from '../user/user.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order)
		private orderRepo: Repository<Order>,
		@InjectRepository(OrderItem)
		private orderItemRepo: Repository<OrderItem>,
		private userService: UserService,
		private cartService: CartService,
	) {}

	async createOrder(userId: number, cartId: number) {
		const cart = await this.cartService.getCart(cartId);
		const user = await this.userService.getUserById(userId);
		if (cart.items.length == 0)
			throw new BadRequestException('سبد خرید شما خالی است!');
		const order = this.orderRepo.create({
			user,
			totalAmount: cart.total,
			orderItems: [],
		});
		for (const item of cart.items) {
			const orderItem = this.orderItemRepo.create({
				product: item.product,
				quantity: 1,
				priceAtPurchase: item.product.price,
			});
			order.orderItems.push(orderItem);
		}
		const savedOrder = await this.orderRepo.save(order);
		await this.cartService.clearCart(cartId);
		return savedOrder;
	}
}
