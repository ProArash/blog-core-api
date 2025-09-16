import {
	Controller,
	Get,
	Post,
	Req,
	Delete,
	Query,
	UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Request } from 'express';
import { UserPayload } from '../../utils/user.payload';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
@Roles(UserRole.USER)
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Post('addCart')
	addProduct(@Query('productId') productId: number, @Req() req: Request) {
		const { id } = req.user as UserPayload;
		return this.cartService.addItemToCart(id, productId);
	}

	@Get('getCart')
	getCart(@Req() req: Request) {
		const { id } = req.user as UserPayload;
		return this.cartService.getCart(id);
	}

	@Delete('deleteFromCart')
	deleteProductFromCart(
		@Query('productId') productId: number,
		@Req() req: Request,
	) {
		const { id } = req.user as UserPayload;
		return this.cartService.removeProductFromCart(id, productId);
	}
}
