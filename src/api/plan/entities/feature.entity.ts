import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { PlanEntity } from './plan.entity';

@Entity()
export class FeatureEntity extends FixedEntity {
	@Column()
	title: string;

	@ManyToOne(() => PlanEntity, (plan) => plan.features, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	plan: PlanEntity;
}
