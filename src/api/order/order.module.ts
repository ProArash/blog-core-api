import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { UserModule } from '../user/user.module';
import { PlanModule } from '../plan/plan.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([OrderEntity]),
		PlanModule,
		UserModule,
		DiscountModule,
	],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}
