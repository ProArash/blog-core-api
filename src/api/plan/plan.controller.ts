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
	UseInterceptors,
	UploadedFiles,
	BadRequestException,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from '../user/entities/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Post('newPlan')
	async newPlan(@Body(new ValidationPipe()) createPlanDto: CreatePlanDto) {
		return await this.planService.newPlan(createPlanDto);
	}

	@Get('getAllPlans')
	async getAllPlans() {
		return await this.planService.findAll();
	}

	@Get('getPlanById')
	getPlanById(@Query('planId') planId: string) {
		return this.planService.getPlanById(+planId);
	}

	@Get('getPlanBySlug')
	getPlanBySlug(@Query('slug') slug: string) {
		return this.planService.getPlanBySlug(slug);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Patch('updatePlanById')
	updatePlanById(@Body(new ValidationPipe()) updatePlanDto: UpdatePlanDto) {
		return this.planService.updatePlanById(updatePlanDto);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Post('uploadPlanImage')
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Medias to upload',
		schema: {
			type: 'object',
			properties: {
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
					},
				},
			},
		},
	})
	@UseInterceptors(
		FilesInterceptor('images', 5, {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					const fileName = `plan-${uuid()}${extname(file.originalname)}`;
					return cb(null, fileName);
				},
			}),
		}),
	)
	async uploadPlanImage(
		@Query('planId') planId: string,
		@UploadedFiles() files: Express.Multer.File[],
	) {
		if (!files || files.length == 0)
			throw new BadRequestException('فایل رسانه اجباری است');
		if (!planId) throw new BadRequestException('ایدی محصول اجباری است');
		const urls = files.map((v) => `/uploads/${v.filename}`);
		return await this.planService.uploadPlanImages(urls, +planId);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Delete('deletePlanById')
	deletePlanById(@Query('planId') planId: string) {
		return this.planService.deletePlanById(+planId);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Delete('deleteMediaById')
	deleteMediaById(@Query('mediaId') mediaId: string) {
		return this.planService.deleteMediaById(+mediaId);
	}
}
