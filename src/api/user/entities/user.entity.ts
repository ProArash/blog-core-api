import { Column, Entity, OneToMany } from 'typeorm';
import { FixedEntity } from '../../utils/fixed.model';
import { PlanEntity } from '../../plan/entities/plan.entity';

@Entity()
export class UserEntity extends FixedEntity {
	@Column({
		nullable: true,
	})
	name: string;

	@Column({
		unique: true,
	})
	mobile: string;

	@Column({
		select: false,
	})
	password: string;

	@Column({
		nullable: true,
	})
	otp: number;

	@OneToMany(() => PlanEntity, (plan) => plan.user, { cascade: true })
	plans: PlanEntity[];
}
