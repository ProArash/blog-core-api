import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order.item.entity';
import { UserService } from '../user/user.service';
import { CartService } from '../cart/cart.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import axios from 'axios';
import {
	ZibalNewUrlRequest,
	ZibalNewUrlResponse,
	ZibalVerifyResponse,
} from './dto/zibal.dto';

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

	async createOrder(userId: number) {
		const cart = await this.cartService.getCart(userId);
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
		return {
			paymentUrl: await this.generatePaymentUrl(
				savedOrder.totalAmount,
				`${savedOrder.id.toString()}_${cart.cartId}`,
			),
		};
	}

	async getAllOrders(userId: number, page: number) {
		const take = 20;
		const skip = (page - 1) * take;
		return await this.orderRepo.find({
			take,
			skip,
			where: {
				user: {
					id: userId,
				},
			},
			order: {
				updatedAt: 'DESC',
			},
		});
	}
	async getOrderById(orderId: number) {
		const order = await this.orderRepo.findOne({
			where: {
				id: orderId,
			},
		});
		if (!order) throw new NotFoundException('سفارش یافت نشد.');
		return order;
	}

	async updateOrderById(dto: UpdateOrderDto) {
		const order = await this.getOrderById(dto.orderId);
		order.status = dto.status;
		await order.save();
		return true;
	}

	async generatePaymentUrl(amount: number, orderId: string) {
		const newUrlBody: ZibalNewUrlRequest = {
			merchant: 'zibal',
			orderId,
			amount: amount * 10,
			description: 'some description',
			callbackUrl: 'http://localhost:4000/order/callback',
		};
		const request = await axios.post(
			'https://gateway.zibal.ir/v1/request',
			newUrlBody,
		);
		const result: ZibalNewUrlResponse = request.data as ZibalNewUrlResponse;
		await this.orderRepo.update(+orderId, {
			trackId: result.trackId.toString(),
		});
		return `https://gateway.zibal.ir/start/${result.trackId}`;
	}

	async handleCallback(status: number, trackId: number, orderId: string) {
		const [oId, cartId] = orderId.split('_');
		const dto = {
			merchant: 'zibal',
			trackId,
		};
		const verifyReq = await axios.post(
			'https://gateway.zibal.ir/v1/verify',
			dto,
		);
		if (verifyReq.status != 200) {
			throw new BadRequestException('تایید تراکنش ناموفق');
		}
		const verifyResponse = verifyReq.data as ZibalVerifyResponse;
		await this.updateOrderById({
			orderId: +oId,
			status:
				verifyResponse.status == 1 ? OrderStatus.PAID : OrderStatus.CANCELLED,
		});
		if (verifyResponse.status == 1) {
			await this.cartService.clearCart(+cartId);
		}

		return true;
	}
}
