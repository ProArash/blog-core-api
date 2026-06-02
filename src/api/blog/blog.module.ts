import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '@/api/blog/entities/blog.entity';
import { UserModule } from '@/api/user/user.module';
import { MediaModule } from '@/api/media/media.module';

@Module({
	imports: [TypeOrmModule.forFeature([Blog]), UserModule, MediaModule],
	controllers: [BlogController],
	providers: [BlogService],
})
export class BlogModule {}
