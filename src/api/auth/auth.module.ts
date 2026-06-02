// src/api/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { RolesGuard } from './roles.guard';
import { JwtStrategy } from '@/api/auth/jwt.guard';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('SECRET', 'secret'),
				signOptions: {
					expiresIn: '15m',
				},
			}),
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, RolesGuard],
	exports: [AuthService, JwtStrategy, RolesGuard, JwtModule],
})
export class AuthModule {}
