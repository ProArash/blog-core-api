import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { PlanService } from '../plan/plan.service';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { DiscountService } from '../discount/discount.service';
import {
	ZibalCreatePayRequest,
	ZibalTrackIdResponse,
	ZibalVerifyRequest,
	IZibalVerifyResponse,
} from './zibal.dto';
import { CourseService } from '../course/course.service';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(OrderEntity)
		private orderRepo: Repository<OrderEntity>,
		private planService: PlanService,
		private courseService: CourseService,
		private userService: UserService,
		private configService: ConfigService,
		private discountService: DiscountService,
	) {}
	async newPlanPayment(planId: number, userId: number) {
		const plan = await this.planService.getPlanById(planId);
		const user = await this.userService.getUserById(userId);

		const price = plan.price * 10;
		const merchantCode =
			this.configService.get<string>('ENV') == 'dev'
				? 'zibal'
				: this.configService.get<string>('MERCHANT_CODE') || 'zibal';
		const order = await this.orderRepo
			.create({
				user: user,
				amount: price,
				plan: {
					id: plan.id,
				},
			})
			.save();

		const body: ZibalCreatePayRequest = {
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

	async newCoursePayment(courseId: number, userId: number) {
		const user = await this.userService.getUserById(userId);
		const course = await this.courseService.getById(courseId);
		const price = course.price * 10;
		const merchantCode =
			this.configService.get<string>('ENV') == 'dev'
				? 'zibal'
				: this.configService.get<string>('MERCHANT_CODE') || 'zibal';
		const order = await this.orderRepo
			.create({
				user: user,
				amount: price,
				course,
			})
			.save();

		const body: ZibalCreatePayRequest = {
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

	async verifyPayment(trackId: number, orderId: string) {
		const order = await this.getOrderById(Number(orderId));
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
			order.amount = verifyResponse.amount;
			await order.save();
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

	async getUserPlans(userId: number, pageNumber: number) {
		const limit = 10;
		const skip = (pageNumber - 1) * limit;
		const userOrders = await this.orderRepo.find({
			take: limit,
			skip,
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

	async getUserCourses(userId: number, pageNumber: number) {
		const limit = 10;
		const skip = (pageNumber - 1) * limit;
		const userOrders = await this.orderRepo.find({
			take: limit,
			skip,
			where: {
				user: {
					id: userId,
				},
			},
			relations: {
				course: true,
			},
			select: {
				id: true,
				status: true,
				amount: true,
				trackId: true,
			},
		});
		return userOrders.map((v) => ({ ...v, amount: v.amount / 10 })).reverse();
	}
}
