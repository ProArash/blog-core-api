import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: 'http://localhost:3000',
		credentials: true,
	});
	app.use(cookieParser());
	const config = new DocumentBuilder()
		.setTitle('Kamangir')
		.setDescription('Kamangir api')
		.setVersion('0.1')
		.addTag('arash.vip')
		.addBearerAuth()
		.build();
	const document = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);
	await app.listen(PORT);
}
bootstrap()
	.then(() => {
		console.log(`server is running on port ${PORT}`);
	})
	.catch((err) => console.log(err));
