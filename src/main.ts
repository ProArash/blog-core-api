import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BasicInterceptor } from './basic.interceptor';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: true,
		credentials: true,
	});
	app.use(cookieParser());
	app.useGlobalInterceptors(new BasicInterceptor());
	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory: (errors: ValidationError[]) => {
				const errorObject: Record<string, string> = {};
				const errorStrings: string[] = [];
				errors.forEach((err) => {
					if (err.constraints) {
						errorObject[err.property] = Object.values(err.constraints).join(
							', ',
						);
						errorStrings.push(Object.values(err.constraints).toString());
					}
				});
				return new HttpException(
					{
						message: 'خطا در ورود اطلاعات',
						status: HttpStatus.BAD_REQUEST,
						properties: errorObject,
						errors: errorStrings,
					},
					HttpStatus.BAD_REQUEST,
				);
			},
		}),
	);
	const config = new DocumentBuilder()
		.setTitle('Kamangir')
		.setDescription('Kamangir api')
		.setVersion('0.1')
		.addTag('arash.vip')
		.build();
	const document = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/', app, document);
	await app.listen(PORT);
}
bootstrap()
	.then(() => {
		console.log(`server is running on port ${PORT}`);
	})
	.catch((err) => console.log(err));
