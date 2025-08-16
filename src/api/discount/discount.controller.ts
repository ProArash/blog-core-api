import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Delete,
	Query,
	ValidationPipe,
	UseGuards,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';
import { CheckDiscountCodeDto } from './dto/check-discount.dto';

@Controller('discount')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRoles.ADMIN)
export class DiscountController {
	constructor(private readonly discountService: DiscountService) {}

	@Post('newDiscount')
	async newDiscount(@Body() createDiscountDto: CreateDiscountDto) {
		return await this.discountService.newDiscount(createDiscountDto);
	}

	@Get('getAllDiscounts')
	async getAllDiscounts() {
		return await this.discountService.getAllDiscounts();
	}

	@Get('getDiscountById')
	async findOne(@Query('discountId') discountId: string) {
		return await this.discountService.getDiscountById(+discountId);
	}

	@Post('checkDiscountCode')
	async checkDiscountCode(
		@Body(new ValidationPipe()) discountDto: CheckDiscountCodeDto,
	) {
		return this.discountService.checkDiscountCode(discountDto);
	}

	@Patch('updateDiscountById')
	async update(
		@Query('discountId') discountId: string,
		@Body(new ValidationPipe()) updateDiscountDto: UpdateDiscountDto,
	) {
		return await this.discountService.updateDiscountById(
			+discountId,
			updateDiscountDto,
		);
	}

	@Delete('deleteDiscountById')
	async remove(@Query('discountId') id: string) {
		return await this.discountService.remove(+id);
	}
}
