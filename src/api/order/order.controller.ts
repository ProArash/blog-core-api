import {
	Controller,
	Get,
	Post,
	Body,
	UseGuards,
	ValidationPipe,
	Req,
	Query,
	ParseIntPipe,
	Put,
	Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { Request, Response } from 'express';
import { UserPayload } from '../../utils/user.payload';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
@UseGuards(AuthGuard('jwt'))
@Roles(UserRole.USER)
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post('newOrder')
	async newOrder(
		@Body(new ValidationPipe()) dto: CreateOrderDto,
		@Req() req: Request,
	) {
		const { id: userId } = req.user as UserPayload;
		return await this.orderService.createOrder(userId);
	}

	@Get('getAllOrders')
	async getAllOrders(
		@Query('page', ParseIntPipe) page: number,
		@Req() req: Request,
	) {
		const { id: userId } = req.user as UserPayload;

		return await this.orderService.getAllOrders(userId, page);
	}

	@Get('getOrderById')
	async getOrderById(@Query('orderId', ParseIntPipe) orderId: number) {
		return await this.orderService.getOrderById(orderId);
	}

	@Get('callback')
	async callback(
		@Query('success') success: number,
		@Query('status') status: number,
		@Query('trackId') trackId: number,
		@Query('orderId') orderId: string,
		@Res() res: Response,
	) {
		if (success != 1) {
			res.redirect(
				`http://localhost:3000/order/?success=false&orderId=${orderId}&trackId=${trackId}`,
			);
		}
		await this.orderService.handleCallback(status, trackId, +orderId);
		res.redirect(
			`http://localhost:3000/order/?success=true&orderId=${orderId}&trackId=${trackId}`,
		);
	}

	@Put('updateOrder')
	async updateOrder(@Body(new ValidationPipe()) dto: UpdateOrderDto) {
		return await this.orderService.updateOrderById(dto);
	}
}
