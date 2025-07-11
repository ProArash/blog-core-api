import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { FixedEntity } from '../../utils/fixed.model';
import { FeatureEntity } from './feature.entity';
import { ContextEntity } from './context.entity';
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

	@OneToMany(() => FeatureEntity, (feature) => feature.plan, { cascade: true })
	features: FeatureEntity[];

	@OneToMany(() => ContextEntity, (entity) => entity.plan, { cascade: true })
	context: ContextEntity[];

	@ManyToOne(() => UserEntity, (user) => user.plans)
	user: UserEntity;
}
