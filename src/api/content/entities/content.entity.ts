import { ContentSkill } from '@/api/content/entities/content-skill.entity';
import { Media } from '@/api/media/entities/media.entity';
import { FixedEntity } from '@/utils/entities/fixed.entity';
import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
} from 'typeorm';

@Entity()
export class Content extends FixedEntity {
	@Column({ type: 'simple-json', nullable: true })
	footer_links: string[];

	@Column({ nullable: true })
	footer_caption: string;

	@ManyToOne(() => Media, (media) => media.footer_logo_contents, {
		nullable: true,
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'footer_logo_id' })
	footer_logo: Media | null;

	@Column({ nullable: true })
	footer_mobile: string;

	@Column({ nullable: true })
	footer_email: string;

	@Column({ nullable: true })
	footer_telegram: string;

	@Column({ nullable: true })
	footer_whatsapp: string;

	@ManyToOne(() => Media, (media) => media.header_avatar_image_contents, {
		nullable: true,
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'header_avatar_image_id' })
	header_avatar_image: Media | null;

	@ManyToMany(() => Media, (media) => media.header_slider_image_contents)
	@JoinTable({
		name: 'content_header_slider_images',
		joinColumn: {
			name: 'content_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'media_id',
			referencedColumnName: 'id',
		},
	})
	header_slider_images: Media[];

	@Column({ nullable: true })
	header_h1_title: string;

	@Column({ nullable: true })
	header_caption: string;

	@OneToMany(() => ContentSkill, (skill) => skill.content, {
		cascade: true,
	})
	skills: ContentSkill[];
}
