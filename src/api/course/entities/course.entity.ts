import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { FixedEntity } from '../../../utils/fixed.model';
import { UserEntity } from '../../user/entities/user.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { CourseTitleEntity } from './course.title.entity';

@Entity()
export class CourseEntity extends FixedEntity {
	@Column()
	name: string;

	@Column()
	price: number;

	@Column()
	minMember: number;

	@Column()
	maxMember: number;

	@Column()
	status: boolean;

	@Column({
		nullable: true,
	})
	imageUrl: string;

	@ManyToOne(() => UserEntity, (user) => user.courses)
	user: UserEntity;

	@OneToMany(() => OrderEntity, (order) => order.course)
	orders: OrderEntity[];

	@OneToMany(() => CourseTitleEntity, (title) => title.course, {
		cascade: ['insert', 'update'],
		eager: true,
	})
	titles: CourseTitleEntity[];
}
