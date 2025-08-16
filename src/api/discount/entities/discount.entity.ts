import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class DiscountEntity extends FixedEntity {
	@Column()
	discountCode: string;

	@Column()
	discountPercent: number;

	@ManyToOne(() => UserEntity, (user) => user.discounts)
	user: UserEntity;
}
