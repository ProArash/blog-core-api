import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	Put,
	Query,
	Get,
	BadRequestException,
	Delete,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('course')
export class CourseController {
	constructor(private readonly courseService: CourseService) {}

	@Post('newCourse')
	newCourse(@Body(new ValidationPipe()) createCourseDto: CreateCourseDto) {
		return this.courseService.newCourse(createCourseDto);
	}

	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				image: {
					type: 'string',
					format: 'binary',
					description: 'image for course',
				},
			},
			required: ['image'],
		},
	})
	@Post('uploadCourseImage')
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					const fileName: string = `course-${uuid()}${extname(file.originalname)}`;
					cb(null, fileName);
				},
			}),
		}),
	)
	async uploadCourseImage(
		@UploadedFile() file: Express.Multer.File,
		@Query('courseId') courseId: string,
	) {
		const fileName = '/uploads/' + file.filename;
		return await this.courseService.uploadCourseImage(fileName, +courseId);
	}

	@Get('getAll')
	getAllCourses(@Query('pageNumber') pageNumber: string) {
		if (!pageNumber || pageNumber == '')
			throw new BadRequestException('شماره صفحه اجباری است.');
		return this.courseService.getAllCourse(+pageNumber);
	}

	@Put('updateById')
	updateCourse(
		@Body(new ValidationPipe()) updateDto: UpdateCourseDto,
		@Query('id') id: string,
	) {
		return this.courseService.updateCourseById(updateDto, +id);
	}

	@Delete('deleteCourseById')
	deleteCourseById(@Query('id') id: string) {
		return this.courseService.deleteCourseById(+id);
	}
}
