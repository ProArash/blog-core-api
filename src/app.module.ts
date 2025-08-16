import { Module } from '@nestjs/common';
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
	],
})
export class AppModule {}
