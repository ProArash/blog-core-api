import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
	@ApiProperty({ example: 'some name' })
	@IsNotEmpty()
	name: string;

	@ApiProperty({ example: 'some caption' })
	@IsNotEmpty()
	caption: string;

	@ApiProperty({ example: 10000 })
	@IsNotEmpty()
	price: number;

	@ApiProperty({ example: 'ecommerce-webapp' })
	@IsNotEmpty()
	slug: string;

	@ApiProperty({ example: [{ title: 'context 1' }] })
	@IsNotEmpty()
	contexts: TitleDto[];

	@ApiProperty({ example: true })
	@IsNotEmpty()
	status: boolean;

	@ApiProperty({ example: [{ title: 'Feature 1' }] })
	@IsNotEmpty()
	features: TitleDto[];

	@ApiProperty({ example: [{ title: 'tag1' }, { title: 'tag2' }] })
	@IsNotEmpty()
	tags: TitleDto[];
}

class TitleDto {
	@ApiProperty({ example: 'some title' })
	title: string;
}
