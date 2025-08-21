import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { PayStatus } from './entities/pay.status';
import { ZibalCreatePaymentResponse, ZibalVerifyResponse } from './zibal.dto';
import axios from 'axios';
import { PlanService } from '../plan/plan.service';

export const callbackUrl: string = 'http://localhost:4000/invoice/callback';
export const MERCHANT_CODE = process.env.MERCHANT_CODE ?? 'zibal';

export interface PaymentUrlRequest {
	merchant: string;
	amount: number;
	callbackUrl: string;
	description?: string;
	mobile?: string;
	orderId: string;
}

@Injectable()
export class InvoiceService {
	constructor(
		@InjectRepository(InvoiceEntity)
		private repo: Repository<InvoiceEntity>,
		private planService: PlanService,
	) {}

	async newPlanInvoice(userId: number, planId: number) {
		const plan = await this.planService.getPlanById(planId);
		const invoice = await this.repo
			.create({
				user: {
					id: userId,
				},
				plan: {
					id: planId,
				},
				amount: plan.price,
			})
			.save();
		return await this.newPaymentUrl({
			amount: plan.price * 10,
			callbackUrl,
			merchant: MERCHANT_CODE,
			orderId: invoice.id.toString(),
			description: `سفارش شماره #${invoice.id}`,
		});
	}

	async handleCallback(trackId: string, orderId: string, success: number) {
		const body = {
			merchant: MERCHANT_CODE,
			trackId: +trackId,
		};
		await axios.post<ZibalVerifyResponse>(
			'https://gateway.zibal.ir/v1/verify',
			body,
		);
		const invoice = await this.repo.findOne({
			where: {
				id: +orderId,
			},
		});
		if (!invoice) throw new NotFoundException('سفارش یافت نشد.');
		invoice.status = success == 1 ? PayStatus.PAYED : PayStatus.CANCELLED;
		invoice.trackId = trackId;
		await invoice.save();
		return invoice;
	}

	async getUserInvoices(pageNumber: number, userId: number) {
		const limit = 20;
		const skip = (pageNumber - 1) * limit;
		const [invoices, totalCount] = await this.repo.findAndCount({
			where: {
				user: {
					id: userId,
				},
			},
			relations: {
				plan: true,
			},
			order: {
				createdAt: 'DESC',
			},
			take: limit,
			skip,
		});
		return {
			totalCount,
			data: invoices,
		};
	}

	async getUserInvoiceById(invoiceId: number, userId: number) {
		return await this.repo.findOne({
			where: {
				id: invoiceId,
				user: {
					id: userId,
				},
			},
			relations: {
				plan: true,
			},
		});
	}

	async newPaymentUrl(payDto: PaymentUrlRequest) {
		const body = {
			merchant: MERCHANT_CODE,
			amount: payDto.amount,
			callbackUrl,
			description: payDto.description,
			mobile: payDto.mobile,
			orderId: payDto.orderId,
		};
		const newPaymentReq = await axios.post<ZibalCreatePaymentResponse>(
			'https://gateway.zibal.ir/v1/request',
			body,
		);
		return {
			url: `https://gateway.zibal.ir/start/${newPaymentReq.data.trackId}`,
		};
	}
}
