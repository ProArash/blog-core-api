import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayUnique,
	IsArray,
	IsInt,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateBlogDto {
	@ApiProperty({ example: 'My First Blog Post' })
	@IsString()
	title: string;

	@ApiProperty({ example: 'my-first-blog-post' })
	@IsString()
	slug: string;

	@ApiProperty({ example: 'This is the content of my first blog post.' })
	@IsString()
	description: string;

	@ApiPropertyOptional({ example: ['nestjs', 'typescript', 'blog'] })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	seo_keywords?: string[];

	@ApiPropertyOptional({ example: 'A short description for SEO purposes.' })
	@IsOptional()
	@IsString()
	seo_short_description?: string;

	@ApiPropertyOptional({ example: [1, 2, 3] })
	@IsOptional()
	@IsArray()
	@ArrayUnique()
	@Type(() => Number)
	@IsInt({ each: true })
	mediaIds?: number[];
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
