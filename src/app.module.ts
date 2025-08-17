import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlanModule } from './api/plan/plan.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BlogModule } from './api/blog/blog.module';
import { MediaModule } from './api/media/media.module';
import { InquiryModule } from './api/inquiry/inquiry.module';
import { PortfolioModule } from './api/portfolio/portfolio.module';
import { DiscountModule } from './api/discount/discount.module';
import { InvoiceModule } from './api/invoice/invoice.module';
import { UserService } from './api/user/user.service';

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
				type: 'mysql',
				url: configService.get<string>('DB_URL'),
				autoLoadEntities: true,
				synchronize: true,
				charset: 'utf8mb4',
				collation: 'utf8mb4_unicode_ci',
			}),
		}),
		PlanModule,
		UserModule,
		AuthModule,
		BlogModule,
		MediaModule,
		InquiryModule,
		PortfolioModule,
		DiscountModule,
		InvoiceModule,
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
