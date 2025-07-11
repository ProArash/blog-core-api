import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ValidationPipe,
	UseGuards,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanEntity } from './entities/plan.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@UseGuards(AuthGuard('jwt'))
	@Post()
	async create(@Body(new ValidationPipe()) createPlanDto: CreatePlanDto) {
		await this.planService.create(createPlanDto);
	}

	@Get()
	async findAll(): Promise<PlanEntity[]> {
		return await this.planService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.planService.findOne(+id);
	}

	@UseGuards(AuthGuard('jwt'))
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body(new ValidationPipe()) updatePlanDto: UpdatePlanDto,
	) {
		return this.planService.update(+id, updatePlanDto);
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.planService.remove(+id);
	}
}
