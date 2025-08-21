import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from '../user/entities/user.entity';
import { Request, Response } from 'express';
import { UserPayload } from '../../utils/user.payload';
import { ApiQuery } from '@nestjs/swagger';

@Controller('invoice')
export class InvoiceController {
	constructor(private readonly invoiceService: InvoiceService) {}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.USER)
	@Get('newPlanInvoice')
	async newPlanInvoice(@Query('planId') planId: string, @Req() req: Request) {
		const user = req.user as UserPayload;
		return await this.invoiceService.newPlanInvoice(user.id, +planId);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.USER)
	@Get('getUserInvoices')
	@ApiQuery({
		name: 'pageNumber',
		default: 1,
	})
	async getUserInvoices(
		@Query('pageNumber')
		pageNumber: number,
		@Req() req: Request,
	) {
		const user = req.user as UserPayload;
		return await this.invoiceService.getUserInvoices(pageNumber, user.id);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.USER)
	@Get('getUserInvoiceById')
	async getUserInvoiceById(
		@Query('invoiceId')
		invoiceId: number,
		@Req() req: Request,
	) {
		const user = req.user as UserPayload;
		return await this.invoiceService.getUserInvoiceById(invoiceId, user.id);
	}

	@Get('callback')
	async handleCallback(
		@Query('success') success: string,
		@Query('status') status: string,
		@Query('trackId') trackId: string,
		@Query('orderId') orderId: string,
		@Res() res: Response,
	) {
		const invoice = await this.invoiceService.handleCallback(
			trackId,
			orderId,
			+success,
		);
		return res.redirect(`http://localhost:3000/invoice/${invoice.id}`);
	}
}
