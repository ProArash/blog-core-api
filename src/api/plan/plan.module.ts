import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { FeatureEntity } from './entities/feature.entity';
import { ContextEntity } from './entities/context.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([PlanEntity, FeatureEntity, ContextEntity]),
	],
	controllers: [PlanController],
	providers: [PlanService],
})
export class PlanModule {}
