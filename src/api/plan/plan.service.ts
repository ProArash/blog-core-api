import { Injectable } from '@nestjs/common';
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
		return await this.planRepo.create(createPlanDto).save();
	}

	async findAll() {
		return await this.planRepo.find();
	}

	async findOne(id: number) {
		return await this.planRepo.findOne({
			where: {
				id,
			},
			relations: {
				context: true,
				features: true,
			},
		});
	}

	async update(id: number, updatePlanDto: UpdatePlanDto) {
		return await this.planRepo.update(id, updatePlanDto);
	}

	async remove(id: number) {
		return await this.planRepo.delete(id);
	}
}
