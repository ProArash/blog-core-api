import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/fixed.model';
import { UserEntity } from '../../user/entities/user.entity';
import { PlanEntity } from '../../plan/entities/plan.entity';
import { CourseEntity } from '../../course/entities/course.entity';

@Entity()
export class OrderEntity extends FixedEntity {
	@Column({
		default: false,
	})
	status: boolean;

	@Column('bigint')
	amount: number;

	@Column({
		nullable: true,
	})
	trackId: string;

	@Column({
		nullable: true,
	})
	usedDiscountCode: string;

	@ManyToOne(() => UserEntity, (user) => user.orders)
	user: UserEntity;

	@ManyToOne(() => PlanEntity, (plan) => plan.orders)
	plan: PlanEntity;

	@ManyToOne(() => CourseEntity, (course) => course.orders)
	course: CourseEntity;
}
