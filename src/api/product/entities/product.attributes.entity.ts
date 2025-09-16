import { Column, Entity, ManyToOne } from 'typeorm';
import { IProduct, Product } from './product.entity';
import { FixedEntity } from '../../../utils/entities/fixed.entity';

export interface IProductAttribute {
	id: number;
	key: string;
	value: string;
	product: IProduct;
}

@Entity()
export class ProductAttribute extends FixedEntity {
	@Column()
	key: string;

	@Column()
	value: string;

	@ManyToOne(() => Product, (product) => product.attributes)
	product: IProduct;
}
