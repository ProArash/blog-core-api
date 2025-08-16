import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { UserModule } from '../user/user.module';
import { FeatureEntity } from './entities/feature.entity';
import { ContextEntity } from './entities/context.entity';
import { MediaModule } from '../media/media.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([PlanEntity, FeatureEntity, ContextEntity]),
		UserModule,
		MediaModule,
	],
	controllers: [PlanController],
	providers: [PlanService],
	exports: [TypeOrmModule, PlanService],
})
export class PlanModule {}
