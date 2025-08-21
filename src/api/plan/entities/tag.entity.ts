import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { PlanEntity } from './plan.entity';

@Entity()
export class TagEntity extends FixedEntity {
	@Column()
	title: string;

	@ManyToOne(() => PlanEntity, (plan) => plan.tags)
	plan: PlanEntity;
}
