import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
	@ApiProperty()
	@IsNotEmpty()
	planId: string;

	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	context: string[];

	@ApiProperty()
	@IsNotEmpty()
	features: string[];

	@ApiProperty()
	@IsNotEmpty()
	price: number;

	@ApiProperty()
	@IsNotEmpty()
	status: boolean;

	@ApiProperty()
	@IsNotEmpty()
	caption: string;
}
