import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: 'http://localhost:3000',
		credentials: true,
	});
	app.use(cookieParser());
	await app.listen(PORT);
}
bootstrap()
	.then(() => {
		console.log(`server is running on port ${PORT}`);
	})
	.catch((err) => console.log(err));
