import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../utils/fixed.model';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class PlanEntity extends FixedEntity {
	@Column()
	name: string;

	@Column()
	price: number;

	@Column()
	status: boolean;

	@Column({
		default: true,
	})
	payment_status: boolean;

	@Column('simple-array')
	features: string[];

	@Column('simple-array')
	context: string[];

	@Column()
	caption: string;

	@ManyToOne(() => UserEntity, (user) => user.plans)
	user: UserEntity;
}
