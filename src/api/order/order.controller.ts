import {
	Controller,
	Post,
	Body,
	Req,
	UseGuards,
	Get,
	Query,
	Res,
	Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request, Response } from 'express';
import { UserPayload } from '../../utils/user.payload';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(AuthGuard('jwt'))
	@Post()
	async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
		const userId = req.user as UserPayload;
		return await this.orderService.createNewPayment(createOrderDto, userId.id);
	}

	@Get('verify')
	async verifyPayment(
		@Query('success') success: number,
		@Query('trackId') trackId: number,
		@Query('orderId') orderId: string,
		@Res() res: Response,
	) {
		const status = success == 1 ? true : false;
		await this.orderService.verifyPayment(trackId, status, orderId);
		const redirectUrl =
			process.env.ENV == 'dev'
				? `http://localhost:3000/order/?id=${orderId}`
				: `https://arash.vip/order/?id=${orderId}`;
		return res.redirect(redirectUrl);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('getOrderById')
	async getOrderById(@Query('orderId') orderId: number) {
		const order = await this.orderService.getOrderById(orderId);
		order.amount = order.amount / 10;
		return order;
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('myOrders')
	async getUserOrders(@Req() req: Request) {
		const user = req.user as UserPayload;
		return await this.orderService.getUserOrders(user.id);
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete('deleteUserOrderById')
	async deleteUserOrderById(
		@Query('orderId') orderId: string,
		@Req() req: Request,
	) {
		const user = req.user as UserPayload;
		return await this.orderService.deleteUserOrderById(+orderId, user.id);
	}
}
