import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Max,
	Min,
	ValidateNested,
} from 'class-validator';

export class CreateContentFooterDto {
	@ApiProperty({
		type: [String],
		example: ['https://example.com', 'https://github.com/example'],
	})
	@IsArray()
	@IsUrl({}, { each: true })
	links: string[];

	@ApiProperty({ example: 'some shit' })
	@IsString()
	@IsNotEmpty()
	caption: string;

	@ApiProperty({ example: '09123456789' })
	@IsString()
	@IsNotEmpty()
	mobile: string;

	@ApiProperty({ example: 'test@example.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'https://t.me/example' })
	@IsString()
	@IsNotEmpty()
	telegram: string;

	@ApiProperty({ example: 'https://wa.me/989123456789' })
	@IsString()
	@IsNotEmpty()
	whatsapp: string;
}

export class UpdateContentFooterDto {
	@ApiPropertyOptional({
		type: [String],
		example: ['https://example.com', 'https://github.com/example'],
	})
	@IsOptional()
	@IsArray()
	@IsUrl({}, { each: true })
	links?: string[];

	@ApiPropertyOptional({ example: 'some shit' })
	@IsOptional()
	@IsString()
	caption?: string;

	@ApiPropertyOptional({ example: '09123456789' })
	@IsOptional()
	@IsString()
	mobile?: string;

	@ApiPropertyOptional({ example: 'test@example.com' })
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiPropertyOptional({ example: 'https://t.me/example' })
	@IsOptional()
	@IsString()
	telegram?: string;

	@ApiPropertyOptional({ example: 'https://wa.me/989123456789' })
	@IsOptional()
	@IsString()
	whatsapp?: string;
}

export class CreateContentHeaderDto {
	@ApiProperty({ example: 'some shit' })
	@IsString()
	@IsNotEmpty()
	h1_title: string;

	@ApiProperty({ example: 'some shit' })
	@IsString()
	@IsNotEmpty()
	caption: string;
}

export class UpdateContentHeaderDto {
	@ApiPropertyOptional({ example: 'some shit' })
	@IsOptional()
	@IsString()
	h1_title?: string;

	@ApiPropertyOptional({ example: 'some shit' })
	@IsOptional()
	@IsString()
	caption?: string;
}

export class CreateContentSkillDto {
	@ApiProperty({ example: 'NestJS' })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 70, minimum: 0, maximum: 100 })
	@IsInt()
	@Min(0)
	@Max(100)
	proficiency: number;
}

export class UpdateContentSkillDto {
	@ApiProperty({ example: 'NestJS' })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 70, minimum: 0, maximum: 100 })
	@IsInt()
	@Min(0)
	@Max(100)
	proficiency: number;
}

export class CreateContentDto {
	@ApiProperty({ type: CreateContentFooterDto })
	@ValidateNested()
	@Type(() => CreateContentFooterDto)
	footer: CreateContentFooterDto;

	@ApiProperty({ type: CreateContentHeaderDto })
	@ValidateNested()
	@Type(() => CreateContentHeaderDto)
	header: CreateContentHeaderDto;

	@ApiPropertyOptional({ type: [CreateContentSkillDto] })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateContentSkillDto)
	skills?: CreateContentSkillDto[];
}

export class UpdateContentDto {
	@ApiPropertyOptional({ type: UpdateContentFooterDto })
	@IsOptional()
	@ValidateNested()
	@Type(() => UpdateContentFooterDto)
	footer?: UpdateContentFooterDto;

	@ApiPropertyOptional({ type: UpdateContentHeaderDto })
	@IsOptional()
	@ValidateNested()
	@Type(() => UpdateContentHeaderDto)
	header?: UpdateContentHeaderDto;

	@ApiPropertyOptional({ type: [UpdateContentSkillDto] })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateContentSkillDto)
	skills?: UpdateContentSkillDto[];
}

export class ContentFooterResponseDto {
	@ApiProperty({ type: [String] })
	links: string[];

	@ApiProperty()
	caption: string;

	@ApiProperty({ nullable: true })
	logo: string | null;

	@ApiProperty()
	mobile: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	telegram: string;

	@ApiProperty()
	whatsapp: string;
}

export class ContentHeaderResponseDto {
	@ApiProperty({ nullable: true })
	avatar_image: string | null;

	@ApiProperty({ type: [String] })
	slider_images: string[];

	@ApiProperty()
	h1_title: string;

	@ApiProperty()
	caption: string;
}

export class ContentSkillResponseDto {
	@ApiProperty()
	title: string;

	@ApiProperty()
	proficiency: number;
}

export class ContentResponseDto {
	@ApiProperty({ type: ContentFooterResponseDto })
	footer: ContentFooterResponseDto;

	@ApiProperty({ type: ContentHeaderResponseDto })
	header: ContentHeaderResponseDto;

	@ApiProperty({ type: [ContentSkillResponseDto] })
	skills: ContentSkillResponseDto[];
}
