import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				url: configService.get<string>('DB_URL'),
				autoLoadEntities: true,
				synchronize: configService.get<string>('ENV') == 'dev' ? true : false,
			}),
		}),
		UserModule,
		AuthModule,
	],
})
export class AppModule {}
