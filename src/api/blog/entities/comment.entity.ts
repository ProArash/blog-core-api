import { Entity, Column, ManyToOne } from 'typeorm';
import { Blog } from './blog.entity'; // Adjust path as needed
import { FixedEntity } from '@/utils/entities/fixed.entity';

@Entity()
export class Comment extends FixedEntity {
	@Column({ type: 'text' })
	content: string;

	@ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
	blog: Blog;
}
