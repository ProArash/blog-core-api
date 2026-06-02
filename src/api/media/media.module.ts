import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Media } from '@/api/media/entities/media.entity';
import { Blog } from '@/api/blog/entities/blog.entity';
import { Comment } from '@/api/blog/entities/comment.entity';
import { UserModule } from '@/api/user/user.module';
import { AuthModule } from '@/api/auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Media, Blog, Comment]),
		MulterModule.register({
			limits: {
				fileSize: 1024 * 1024 * 50,
			},
		}),
		UserModule,
		AuthModule,
	],
	controllers: [MediaController],
	providers: [MediaService],
	exports: [TypeOrmModule],
})
export class MediaModule {}
