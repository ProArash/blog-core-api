import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto, IBasicBody } from './create-plan.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
	@IsNotEmpty()
	name?: string | undefined;

	@IsNotEmpty()
	context?: IBasicBody[] | undefined;

	@IsNotEmpty()
	features?: IBasicBody[] | undefined;

	@IsNotEmpty()
	price?: number | undefined;

	@IsNotEmpty()
	status?: boolean | undefined;
}
