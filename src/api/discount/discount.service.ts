import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { Repository } from 'typeorm';
import { PlanService } from '../plan/plan.service';
import { CheckDiscountCodeDto } from './dto/check-discount.dto';

@Injectable()
export class DiscountService {
	constructor(
		@InjectRepository(DiscountEntity)
		private discountRepo: Repository<DiscountEntity>,
		private planService: PlanService,
	) {}

	async newDiscount(createDiscountDto: CreateDiscountDto) {
		const discount = await this.discountRepo.findOne({
			where: {
				discountCode: createDiscountDto.discountCode,
			},
		});
		if (discount) throw new ConflictException('کد تخفیف تکراری است');
		return await this.discountRepo.create({ ...createDiscountDto }).save();
	}

	async getAllDiscounts() {
		return await this.discountRepo.find();
	}

	async getDiscountById(discountId: number) {
		const discount = await this.discountRepo.findOne({
			where: {
				id: discountId,
			},
		});
		if (!discount) throw new NotFoundException('کد تخفیف یافت نشد');
		return discount;
	}

	async getDiscountByCode(discountCode: string) {
		const discount = await this.discountRepo.findOne({
			where: {
				discountCode,
			},
		});
		if (!discount) throw new NotFoundException('کد تخفیف یافت نشد');
		return discount;
	}

	async checkDiscountCode(discountDto: CheckDiscountCodeDto) {
		const discount = await this.discountRepo.findOne({
			where: {
				discountCode: discountDto.discountCode,
			},
		});
		if (!discount) throw new NotFoundException('کد تخفیف یافت نشد');
		const plan = await this.planService.getPlanById(discountDto.planId);
		const price = plan.price - (discount.discountPercent * plan.price) / 100;
		return {
			discountedPrice: price,
			discountId: discount.id,
		};
	}

	async updateDiscountById(
		discountId: number,
		updateDiscountDto: UpdateDiscountDto,
	) {
		return await this.discountRepo.update(discountId, {
			...updateDiscountDto,
		});
	}

	async remove(discountId: number) {
		return await this.discountRepo.delete(discountId);
	}
}
