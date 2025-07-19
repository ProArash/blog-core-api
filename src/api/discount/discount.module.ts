import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { PlanModule } from '../plan/plan.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([DiscountEntity]), UserModule, PlanModule],
	controllers: [DiscountController],
	providers: [DiscountService],
	exports: [DiscountService],
})
export class DiscountModule {}
