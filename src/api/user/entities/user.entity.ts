import { Column, Entity, OneToMany } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { PlanEntity } from '../../plan/entities/plan.entity';

export enum UserRoles {
	USER = 'User',
	ADMIN = 'Admin',
	ROOT = 'Root',
}

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

	@Column('simple-array', {
		nullable: true,
	})
	roles: UserRoles[];

	@OneToMany(() => PlanEntity, (plan) => plan.user, { cascade: true })
	plans: PlanEntity[];
}
