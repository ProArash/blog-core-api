import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private prodRepo: Repository<Product>,
	) {}
	async newProduct(createProductDto: CreateProductDto) {
		let prod = await this.prodRepo.findOne({
			where: {
				name: createProductDto.name,
			},
		});
		if (prod) throw new ConflictException('Duplicate product.');
		prod = await this.prodRepo.create(createProductDto).save();
		return prod.id;
	}

	async updateProductImage(id: number, newMediaUrl: string) {
		const product = await this.getProductById(id);
		if (product.mediaUrl && product.mediaUrl != '') {
			await this.deleteMedia(product.mediaUrl);
		}
		return this.prodRepo.update(id, { mediaUrl: newMediaUrl });
	}

	async deleteMedia(mediaUrl: string) {
		const oldFilePath = join(process.cwd(), mediaUrl);
		await unlink(oldFilePath);
	}

	async getProducts(page: number) {
		const take = 20;
		const skip = (page - 1) * take;
		return await this.prodRepo.find({
			take: take,
			skip,
		});
	}

	async getProductById(id: number) {
		const prod = await this.prodRepo.findOne({
			where: {
				id,
			},
		});
		if (!prod) throw new NotFoundException('Product not found.');
		return prod;
	}

	async updateProduct(id: number, updateProductDto: UpdateProductDto) {
		const prod = await this.getProductById(id);
		Object.assign(prod, updateProductDto);
		await this.prodRepo.save(prod);
		return true;
	}

	async deleteProductById(id: number) {
		const product = await this.getProductById(id);
		if (product.mediaUrl && product.mediaUrl != '') {
			await this.deleteMedia(product.mediaUrl);
		}
		return true;
	}
}
