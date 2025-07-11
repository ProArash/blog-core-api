import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
	@IsNotEmpty()
	name?: string | undefined;

	@IsNotEmpty()
	context?: string[] | undefined;

	@IsNotEmpty()
	features?: string[] | undefined;

	@IsNotEmpty()
	price?: number | undefined;

	@IsNotEmpty()
	status?: boolean | undefined;

	@IsNotEmpty()
	caption?: string | undefined;
}
