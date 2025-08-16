import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { PlanEntity } from './plan.entity';

@Entity()
export class ContextEntity extends FixedEntity {
	@Column()
	title: string;

	@ManyToOne(() => PlanEntity, (plan) => plan.contexts, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	plan: PlanEntity;
}
