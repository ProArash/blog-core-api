import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.guard';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				global: true,
				secret: configService.get<string>('SECRET'),
				signOptions: {
					expiresIn: '30m',
				},
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, ConfigService, JwtAuthGuard],
})
export class AuthModule {}
