import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { CourseTitleEntity } from './entities/course.title.entity';

@Module({
	imports: [TypeOrmModule.forFeature([CourseEntity, CourseTitleEntity])],
	controllers: [CourseController],
	providers: [CourseService],
	exports: [TypeOrmModule, CourseService],
})
export class CourseModule {}
