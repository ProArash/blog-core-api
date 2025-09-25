import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserService } from './api/user/user.service';
import { ProductModule } from './api/product/product.module';
import { CartModule } from './api/cart/cart.module';
import { OrderModule } from './api/order/order.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'uploads'),
			serveRoot: '/uploads',
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mariadb',
				url: configService.get<string>('DB_URL'),
				autoLoadEntities: true,
				synchronize: false,
				migrationsRun: true,
			}),
		}),
		UserModule,
		AuthModule,
		ProductModule,
		CartModule,
		OrderModule,
	],
})
export class AppModule implements OnApplicationBootstrap {
	constructor(
		private userService: UserService,
		private configService: ConfigService,
	) {}
	async onApplicationBootstrap() {
		const info = this.configService.get<string>('ADMIN') || '';
		if (info) {
			const [mobile, password] = info.split(':');
			await this.userService.createAdmin(mobile, password);
		}
	}
}
