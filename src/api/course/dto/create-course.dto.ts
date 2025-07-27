import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateCourseDto {
	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ example: [{ title: 'nodejs course' }] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CourseTitleDto)
	titles: CourseTitleDto[];

	@ApiProperty()
	@IsNotEmpty()
	price: number;

	@ApiProperty({ example: 3 })
	@IsNotEmpty()
	minMember: number;

	@ApiProperty({ example: 5 })
	@IsNotEmpty()
	maxMember: number;

	@ApiProperty()
	@IsNotEmpty()
	status: boolean;
}

export class CourseTitleDto {
	title: string;
}
