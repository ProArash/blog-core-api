import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	caption: string;

	@ApiProperty({ example: 10000 })
	@IsNotEmpty()
	price: number;

	@ApiProperty({ example: [{ title: 'context 1' }] })
	@IsNotEmpty()
	contexts: ContextDto[];

	@ApiProperty({ example: true })
	@IsNotEmpty()
	status: boolean;

	@ApiProperty({ example: [{ title: 'Feature 1' }] })
	@IsNotEmpty()
	features: FeatureDto[];
}

export interface FeatureDto {
	title: string;
}

export interface ContextDto {
	title: string;
}
