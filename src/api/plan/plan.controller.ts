import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Delete,
	ValidationPipe,
	UseGuards,
	Query,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from '../user/entities/user.entity';

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Post()
	async newPlan(@Body(new ValidationPipe()) createPlanDto: CreatePlanDto) {
		await this.planService.create(createPlanDto);
	}

	@Get()
	async getAllPlans() {
		return await this.planService.findAll();
	}

	@Get('getPlanById')
	getPlanById(@Query('planId') planId: string) {
		return this.planService.getPlanById(+planId);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Patch('updatePlanById')
	updatePlanById(@Body(new ValidationPipe()) updatePlanDto: UpdatePlanDto) {
		return this.planService.update(updatePlanDto);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Delete('deletePlanById')
	deletePlanById(@Query('planId') planId: string) {
		return this.planService.remove(+planId);
	}
}
