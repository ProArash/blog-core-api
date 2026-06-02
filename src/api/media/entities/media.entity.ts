import { Blog } from '@/api/blog/entities/blog.entity';
import { Content } from '@/api/content/entities/content.entity';
import { FixedEntity } from '@/utils/entities/fixed.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToMany,
} from 'typeorm';

export enum MediaType {
	IMAGE = 'image',
	VIDEO = 'video',
}

@Entity()
export class Media extends FixedEntity {
	@Column()
	title: string;

	@Column({ type: 'enum', enum: MediaType, default: MediaType.IMAGE })
	type: MediaType;

	@Column()
	url: string;

	@Column({ default: false })
	disable: boolean;

	@ManyToOne(() => Blog, (blog) => blog.media, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'blog_id' })
	blog: Blog | null;

	@OneToMany(() => Content, (content) => content.footer_logo)
	footer_logo_contents: Content[];

	@OneToMany(() => Content, (content) => content.header_avatar_image)
	header_avatar_image_contents: Content[];

	@ManyToMany(() => Content, (content) => content.header_slider_images)
	header_slider_image_contents: Content[];
}
