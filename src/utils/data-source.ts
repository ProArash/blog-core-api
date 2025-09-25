import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const dataSource = new DataSource({
	type: 'mariadb',
	url: process.env.DB_URL!,
	entities: [__dirname + '/../**/*.entity.js'],
	migrations: [__dirname + '/../migrations/*.js'],
	synchronize: false,
	migrationsRun: true,
});
