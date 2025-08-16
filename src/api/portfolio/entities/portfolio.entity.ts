import { Column, Entity, OneToMany } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { MediaEntity } from '../../media/entities/media.entity';

@Entity()
export class PortfolioEntity extends FixedEntity {
	@Column()
	title: string;

	@Column()
	url: string;

	@OneToMany(() => MediaEntity, (media) => media.portfolio)
	medias: MediaEntity[];
}
