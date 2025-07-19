import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from './entities/plan.entity';

@Injectable()
export class PlanService {
	constructor(
		@InjectRepository(PlanEntity)
		private planRepo: Repository<PlanEntity>,
	) {}

	async create(createPlanDto: CreatePlanDto) {
		return await this.planRepo
			.create({
				...createPlanDto,
				price: createPlanDto.price,
			})
			.save();
	}

	async findAll() {
		const plans = await this.planRepo.find({
			select: {
				id: true,
				price: true,
				name: true,
				context: true,
				status: true,
			},
		});
		return plans;
	}

	async getPlanById(id: number) {
		const plan = await this.planRepo.findOne({
			where: {
				id,
			},
		});
		if (!plan) throw new NotFoundException('پلن یافت نشد');
		return plan;
	}

	async update(updatePlanDto: UpdatePlanDto) {
		const plan = await this.planRepo.findOne({
			where: {
				id: +updatePlanDto.planId,
			},
		});
		if (!plan) throw new NotFoundException('پلن یافت نشد');
		plan.caption = updatePlanDto.caption;
		plan.context = updatePlanDto.context;
		plan.features = updatePlanDto.features;
		plan.name = updatePlanDto.name;
		plan.price = updatePlanDto.price;
		plan.status = updatePlanDto.status;
		await plan.save();
		return {
			message: 'عملیات موفق',
		};
	}

	async remove(id: number) {
		return await this.planRepo.delete(id);
	}
}
