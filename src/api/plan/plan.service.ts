import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from './entities/plan.entity';
import { MediaService } from '../media/media.service';

@Injectable()
export class PlanService {
	constructor(
		@InjectRepository(PlanEntity)
		private planRepo: Repository<PlanEntity>,
		private mediaService: MediaService,
	) {}

	async newPlan(createPlanDto: CreatePlanDto) {
		const planId = await this.planRepo.create(createPlanDto).save();
		return { planId: planId.id };
	}

	async findAll() {
		const plans = await this.planRepo.find({
			select: {
				id: true,
				price: true,
				name: true,
				contexts: {
					title: true,
				},
				status: true,
				slug: true,
			},
			relations: {
				contexts: true,
				features: true,
				tags: true,
				medias: true,
			},
		});
		return plans;
	}

	async getPlanById(id: number) {
		const plan = await this.planRepo.findOne({
			where: {
				id,
			},
			relations: {
				contexts: true,
				features: true,
				medias: true,
				tags: true,
			},
		});
		if (!plan) throw new NotFoundException('پلن یافت نشد');
		return plan;
	}

	async getPlanBySlug(slug: string) {
		const plan = await this.planRepo.findOne({
			where: {
				slug,
			},
			relations: {
				contexts: true,
				features: true,
				medias: true,
				tags: true,
			},
		});
		if (!plan) throw new NotFoundException('پلن یافت نشد');
		return plan;
	}

	async updatePlanById(updatePlanDto: UpdatePlanDto) {
		const plan = await this.planRepo.findOne({
			where: {
				id: updatePlanDto.planId,
			},
		});
		if (!plan) throw new NotFoundException('پلن یافت نشد');
		Object.assign(plan, updatePlanDto);
		await plan.save();
		return true;
	}

	async uploadPlanImages(images: string[], planId: number) {
		const plan = await this.getPlanById(planId);
		return await this.mediaService.newPlanMedias(images, plan);
	}

	async deletePlanById(id: number) {
		const plan = await this.planRepo.findOne({
			where: {
				id,
			},
			relations: {
				medias: true,
			},
		});
		if (!plan) throw new NotFoundException('پلن یافت نشد');
		await this.planRepo.delete(plan.id);
		return true;
	}
	async deleteMediaById(mediaId: number) {
		return await this.mediaService.deleteMediaById(mediaId);
	}
}
