import { Comment } from '@/api/blog/entities/comment.entity';
import { Media } from '@/api/media/entities/media.entity';
import { User } from '@/api/user/entities/user.entity';
import { FixedEntity } from '@/utils/entities/fixed.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

export enum BlogStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
	ARCHIVED = 'archived',
}

@Entity()
export class Blog extends FixedEntity {
	@Column()
	title: string;

	@Index()
	@Column({ unique: true })
	slug: string;

	@Column({ type: 'text' })
	description: string;

	@Column({ nullable: true })
	canonical_url: string;

	@Index()
	@Column({ default: false })
	noindex: boolean;

	@Column({ default: false })
	nofollow: boolean;

	@Column({ default: 0 })
	view_count: number;

	@Column({ default: 0 })
	like_count: number;

	@Index()
	@Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.DRAFT })
	status: BlogStatus;

	@Index()
	@Column({ type: 'timestamp', nullable: true })
	published_at: Date | null;

	@ManyToOne(() => User, (user) => user.blogs, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	user: User;

	@OneToMany(() => Comment, (comment) => comment.blog)
	comments: Comment[];

	@OneToMany(() => Media, (media) => media.blog)
	media: Media[];

	@ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
	featured_image: Media | null;
}
