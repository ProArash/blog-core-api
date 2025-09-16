import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductAttribute } from './entities/product.attributes.entity';
import { FileUploadModule } from '../../upload.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Product, ProductAttribute]),
		FileUploadModule,
	],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
