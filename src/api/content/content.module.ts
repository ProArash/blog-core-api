import { Media } from '@/api/media/entities/media.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentSkill } from './entities/content-skill.entity';
import { Content } from './entities/content.entity';
import { UserModule } from '@/api/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Content, ContentSkill, Media]),
		UserModule,
	],
	controllers: [ContentController],
	providers: [ContentService],
})
export class ContentModule {}
