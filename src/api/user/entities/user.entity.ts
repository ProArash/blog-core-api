import { Column, Entity, OneToMany } from 'typeorm';
import { FixedEntity } from '../../utils/fixed.model';
import { PlanEntity } from '../../plan/entities/plan.entity';

@Entity()
export class UserEntity extends FixedEntity {
	@Column()
	name: string;

	@Column({
		unique: true,
	})
	mobile: string;

	@Column({
		nullable: true,
	})
	otp: number;

	@OneToMany(() => PlanEntity, (plan) => plan.user)
	plans: PlanEntity[];
}
