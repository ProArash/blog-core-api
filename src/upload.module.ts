import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

@Module({
	imports: [
		MulterModule.register({
			storage: diskStorage({
				destination: './uploads',
				filename(req, file, callback) {
					const fileName = `${uuid()}${extname(file.originalname)}`;
					callback(null, fileName);
				},
			}),
		}),
	],
	exports: [MulterModule],
})
export class FileUploadModule {}
