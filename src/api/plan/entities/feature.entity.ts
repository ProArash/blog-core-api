import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../utils/fixed.model';
import { PlanEntity } from './plan.entity';

@Entity()
export class FeatureEntity extends FixedEntity {
	@Column()
	title: string;

	@ManyToOne(() => PlanEntity, (plan) => plan.features)
	plan: PlanEntity;
}
