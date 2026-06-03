import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
	IsString,
	IsOptional,
	IsArray,
	IsInt,
	IsBoolean,
	IsEnum,
	IsDateString,
	ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BlogStatus } from '@/api/blog/entities/blog.entity';

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

	@ApiPropertyOptional({
		example: 'https://example.com/blog/my-first-blog-post',
	})
	@IsOptional()
	@IsString()
	canonical_url?: string;

	@ApiPropertyOptional({ example: false })
	@IsOptional()
	@IsBoolean()
	noindex?: boolean;

	@ApiPropertyOptional({ example: false })
	@IsOptional()
	@IsBoolean()
	nofollow?: boolean;

	@ApiPropertyOptional({ enum: BlogStatus, example: BlogStatus.DRAFT })
	@IsOptional()
	@IsEnum(BlogStatus)
	status?: BlogStatus;

	@ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
	@IsOptional()
	@IsDateString()
	published_at?: string;

	@ApiPropertyOptional({ example: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	featured_image_id?: number;

	@ApiPropertyOptional({ example: [1, 2, 3] })
	@IsOptional()
	@IsArray()
	@ArrayUnique()
	@Type(() => Number)
	@IsInt({ each: true })
	mediaIds?: number[];
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
