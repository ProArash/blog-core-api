import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
	@ApiProperty()
	planId: number | undefined;

	@ApiProperty()
	courseId: number | undefined;
}
