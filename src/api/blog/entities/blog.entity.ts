import { Comment } from '@/api/blog/entities/comment.entity';
import { Media } from '@/api/media/entities/media.entity';
import { User } from '@/api/user/entities/user.entity';
import { FixedEntity } from '@/utils/entities/fixed.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Blog extends FixedEntity {
	@Column()
	title: string;

	@Column({ unique: true })
	slug: string;

	@Column({ type: 'text' })
	description: string;

	@Column({ type: 'simple-array', nullable: true })
	seo_keywords: string[];

	@Column({ nullable: true })
	seo_short_description: string;

	@Column({ default: 0 })
	view_count: number;

	@Column({ default: 0 })
	like_count: number;

	@ManyToOne(() => User, (user) => user.blogs, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	user: User;

	@OneToMany(() => Comment, (comment) => comment.blog)
	comments: Comment[];

	@OneToMany(() => Media, (media) => media.blog)
	media: Media[];
}
