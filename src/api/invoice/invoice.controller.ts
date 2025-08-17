import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from '../user/entities/user.entity';
import { Request } from 'express';
import { UserPayload } from '../../utils/user.payload';

@Controller('invoice')
export class InvoiceController {
	constructor(private readonly invoiceService: InvoiceService) {}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.USER)
	@Post('new')
	async newInvoice(@Query('planId') planId: string, @Req() req: Request) {
		const user = req.user as UserPayload;
		return await this.invoiceService.newInvoice(user.id, +planId);
	}

	@Get('getAll')
	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.USER)
	async allUserInvoices(@Query('page') page: string, @Req() req: Request) {
		const user = req.user as UserPayload;
		return await this.invoiceService.getAllInvoices(+page, user.id);
	}

	@Get('callback')
	async handleCallback(
		@Query('success') success: string,
		@Query('status') status: string,
		@Query('trackId') trackId: string,
		@Query('orderId') orderId: string,
	) {
		return await this.invoiceService.handleCallback(trackId, orderId, +success);
	}
}
