import { FixedEntity } from '@/utils/entities/fixed.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Content } from './content.entity';

@Entity()
export class ContentSkill extends FixedEntity {
	@Column()
	title: string;

	@Column()
	proficiency: number;

	@ManyToOne(() => Content, (content) => content.skills, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'content_id' })
	content: Content;
}
