import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { Repository } from 'typeorm';
import { unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class CourseService {
	constructor(
		@InjectRepository(CourseEntity)
		private courseRepo: Repository<CourseEntity>,
	) {}

	async newCourse(createCourseDto: CreateCourseDto) {
		const course = await this.courseRepo.findOne({
			where: {
				name: createCourseDto.name,
			},
		});
		if (course) throw new ConflictException('نام دوره تکراری است.');

		return await this.courseRepo.create(createCourseDto).save();
	}

	async updateCourseById(updateDto: UpdateCourseDto, id: number) {
		return await this.courseRepo.update(id, updateDto);
	}

	async getAllCourse(pageNumber: number) {
		const limit = 10;
		const skip = (pageNumber - 1) * limit;
		return await this.courseRepo.find({
			take: limit,
			skip,
		});
	}

	async getByName(name: string) {
		const course = await this.courseRepo.findOne({
			where: {
				name,
			},
		});
		if (!course) throw new NotFoundException('دوره یافت نشد');
		return course;
	}

	async getById(id: number) {
		const course = await this.courseRepo.findOne({
			where: {
				id,
			},
		});
		if (!course) throw new NotFoundException('دوره یافت نشد');
		return course;
	}

	async uploadCourseImage(imageUrl: string, courseId: number) {
		const course = await this.courseRepo.findOne({
			where: {
				id: courseId,
			},
		});
		if (!course) throw new NotFoundException('دوره یافت نشد');

		if (course.imageUrl)
			unlink(join(process.cwd(), course.imageUrl), (err) => {
				if (err) console.log(err);
			});
		course.imageUrl = imageUrl;
		await course.save();
		return true;
	}

	async deleteCourseById(courseId: number) {
		const course = await this.getById(courseId);
		unlink(join(process.cwd(), course.imageUrl), (err) => {
			if (err) console.log(err);
		});
		await this.courseRepo.delete(course.id);
		return true;
	}
}
