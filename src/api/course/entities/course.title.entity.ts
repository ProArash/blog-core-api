import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/fixed.model';
import { CourseEntity } from './course.entity';

@Entity()
export class CourseTitleEntity extends FixedEntity {
	@Column()
	title: string;

	@ManyToOne(() => CourseEntity, (entity) => entity.titles)
	course: CourseEntity;
}
