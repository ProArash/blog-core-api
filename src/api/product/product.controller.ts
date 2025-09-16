import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Delete,
	Query,
	ValidationPipe,
	UseInterceptors,
	UploadedFile,
	BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('newProduct')
	newProduct(@Body(new ValidationPipe()) createProductDto: CreateProductDto) {
		return this.productService.newProduct(createProductDto);
	}

	@Post('uploadProductImage')
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				image: {
					type: 'string',
					format: 'binary',
					description: 'The product image file',
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor('image'))
	async uploadProductImage(
		@Query('productId') productId: number,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (!file) throw new BadRequestException('File is required.');
		const fileName = `/uploads/${file.filename}`;

		return await this.productService.updateProductImage(productId, fileName);
	}

	@Get('getProducts')
	async getProducts(@Query('page') page: number) {
		return this.productService.getProducts(page);
	}

	@Get('getProductById')
	getProductById(@Query('productId') id: string) {
		return this.productService.getProductById(+id);
	}

	@Patch('updateProduct')
	updateProduct(
		@Query('productId') id: number,
		@Body(new ValidationPipe()) updateProductDto: UpdateProductDto,
	) {
		return this.productService.updateProduct(id, updateProductDto);
	}

	@Delete('deleteProductById')
	deleteProductById(@Query('productId') id: number) {
		return this.productService.deleteProductById(id);
	}
}
