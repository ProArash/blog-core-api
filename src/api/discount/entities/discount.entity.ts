import { Column, Entity } from 'typeorm';
import { FixedEntity } from '../../../utils/fixed.model';

@Entity()
export class DiscountEntity extends FixedEntity {
	@Column()
	discountCode: string;

	@Column()
	discountPercent: number;

	@Column()
	maxUse: number;
}
