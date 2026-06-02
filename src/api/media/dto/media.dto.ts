import { MediaType } from '@/api/media/entities/media.entity';
import {
	IsString,
	IsNotEmpty,
	IsEnum,
	IsOptional,
	IsNumber,
	IsBoolean,
} from 'class-validator';

export class CreateMediaDto {
	@IsNotEmpty()
	title: string;

	@IsEnum(MediaType)
	@IsNotEmpty()
	type: MediaType;

	@IsOptional()
	@IsNumber()
	blogId?: number;
}

export class UpdateMediaDto {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsEnum(MediaType)
	type?: MediaType;

	@IsOptional()
	@IsBoolean()
	disable?: boolean;
}
