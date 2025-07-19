import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { UserModule } from '../user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([PlanEntity]), UserModule],
	controllers: [PlanController],
	providers: [PlanService],
	exports: [TypeOrmModule, PlanService],
})
export class PlanModule {}
