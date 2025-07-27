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
	BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Request, Response } from 'express';
import { UserPayload } from '../../utils/user.payload';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(AuthGuard('jwt'))
	@Post('newPlanPayment')
	async newPlanPayment(@Query('planId') planId: string, @Req() req: Request) {
		const { id: userId } = req.user as UserPayload;
		return await this.orderService.newPlanPayment(+planId, userId);
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('newCoursePayment')
	async newCoursePayment(
		@Query('courseId') courseId: string,
		@Req() req: Request,
	) {
		const { id: userId } = req.user as UserPayload;
		if (!courseId || courseId == '')
			throw new BadRequestException('ایدی دوره اجباری است');
		return await this.orderService.newCoursePayment(+courseId, userId);
	}

	@Get('verify')
	async verifyPayment(
		@Query('success') success: number,
		@Query('trackId') trackId: number,
		@Query('orderId') orderId: string,
		@Res() res: Response,
	) {
		await this.orderService.verifyPayment(trackId, orderId);
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
	@Get('myPlans')
	async getUserPlans(
		@Req() req: Request,
		@Query('pageNumber') pageNumber: string,
	) {
		const user = req.user as UserPayload;
		if (!pageNumber || pageNumber == '')
			throw new BadRequestException('شماره صفحه اجباری است.');
		return await this.orderService.getUserPlans(user.id, +pageNumber);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('myCourses')
	async getUserCourses(
		@Req() req: Request,
		@Query('pageNumber') pageNumber: string,
	) {
		const user = req.user as UserPayload;
		if (!pageNumber || pageNumber == '')
			throw new BadRequestException('شماره صفحه اجباری است.');
		return await this.orderService.getUserCourses(user.id, +pageNumber);
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
