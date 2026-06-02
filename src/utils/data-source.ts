import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const dataSource = new DataSource({
	type: 'mariadb',
	url: process.env.DB_URL!,
	// Use {js,ts} to support both compiled and source files
	entities: [__dirname + '/../**/*.entity.{js,ts}'],
	migrations: [__dirname + '/migrations/*.{js,ts}'], // Removed /../
	synchronize: false,
	migrationsRun: true,
});
