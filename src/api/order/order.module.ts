import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order.item.entity';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { CartModule } from '../cart/cart.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Order, OrderItem]),
		UserModule,
		ProductModule,
		CartModule,
	],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}
