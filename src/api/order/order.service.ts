import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { PlanService } from '../plan/plan.service';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { DiscountService } from '../discount/discount.service';
import { DiscountEntity } from '../discount/entities/discount.entity';
import {
	ZibalCreatePayRequest,
	ZibalTrackIdResponse,
	ZibalVerifyRequest,
	IZibalVerifyResponse,
} from './zibal.dto';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(OrderEntity)
		private orderRepo: Repository<OrderEntity>,
		private planService: PlanService,
		private userService: UserService,
		private configService: ConfigService,
		private discountService: DiscountService,
	) {}
	async createNewPayment(createOrderDto: CreateOrderDto, userId: number) {
		let discount: DiscountEntity | null = null;
		let discountCode: string | undefined = undefined;
		const discountId = createOrderDto.discountId;
		const plan = await this.planService.getPlanById(createOrderDto.planId);
		const user = await this.userService.getUserById(userId);
		if (discountId) {
			discount = await this.discountService.getDiscountById(discountId);
			discountCode = discount.discountCode;
		}
		let price = plan.price * 10;
		price = discount ? price - (price * discount.discountPercent) / 100 : price;
		const merchantCode =
			this.configService.get<string>('ENV') == 'dev'
				? 'zibal'
				: this.configService.get<string>('MERCHANT_CODE') || 'zibal';
		const order = await this.orderRepo
			.create({
				user: user,
				amount: price,
				usedDiscountCode: discountCode,
				plan: {
					id: plan.id,
				},
			})
			.save();

		const body: ZibalCreatePayRequest = {
			...createOrderDto,
			merchant: merchantCode,
			orderId: String(order.id),
			amount: price,
			callbackUrl:
				process.env.ENV == 'dev'
					? 'http://localhost:4000/order/verify'
					: 'https://api.arash.vip/order/verify',
		};
		const urlReq = await axios.post(
			`https://gateway.zibal.ir/v1/request`,
			body,
		);
		const zibalRes = urlReq.data as ZibalTrackIdResponse;
		order.trackId = zibalRes.trackId;
		await order.save();
		return {
			payUrl: `https://gateway.zibal.ir/start/${zibalRes.trackId}`,
		};
	}

	async verifyPayment(trackId: number, status: boolean, orderId: string) {
		const order = await this.getOrderById(Number(orderId));
		const discount = await this.discountService.getDiscountByCode(
			order.usedDiscountCode,
		);
		const merchantCode =
			this.configService.get<string>('ENV') == 'dev'
				? 'zibal'
				: this.configService.get<string>('MERCHANT_CODE') || 'zibal';
		const body: ZibalVerifyRequest = {
			merchant: merchantCode,
			trackId,
		};
		if (order.status) {
			const urlReq = await axios.post(
				`https://gateway.zibal.ir/v1/verify`,
				body,
			);
			const verifyResponse: IZibalVerifyResponse =
				urlReq.data as IZibalVerifyResponse;
			const isSuccess = verifyResponse.status == 1 ? true : false;
			order.trackId = String(trackId);
			order.status = isSuccess;
			discount.maxUse = isSuccess ? discount.maxUse - 1 : discount.maxUse;
			order.amount = verifyResponse.amount;
			await order.save();
			await discount.save();
		}
		return true;
	}

	async getOrderById(orderId: number) {
		const order = await this.orderRepo.findOne({ where: { id: orderId } });
		if (!order) throw new NotFoundException('سفارش یافت نشد');
		return order;
	}

	async deleteUserOrderById(orderId: number, userId: number) {
		const order = await this.orderRepo.findOne({
			where: {
				id: orderId,
				user: {
					id: userId,
				},
			},
		});
		if (!order) throw new NotFoundException('سفارش یافت نشد');
		await this.orderRepo.delete(order.id);
		return true;
	}

	async getUserOrders(userId: number) {
		const userOrders = await this.orderRepo.find({
			where: {
				user: {
					id: userId,
				},
			},
			relations: {
				plan: true,
			},
			select: {
				id: true,
				status: true,
				amount: true,
				trackId: true,
				plan: {
					name: true,
					price: true,
				},
			},
		});
		return userOrders.map((v) => ({ ...v, amount: v.amount / 10 })).reverse();
	}
}
