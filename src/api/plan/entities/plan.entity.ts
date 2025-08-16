import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ContextEntity } from './context.entity';
import { FeatureEntity } from './feature.entity';
import { MediaEntity } from '../../media/entities/media.entity';

@Entity()
export class PlanEntity extends FixedEntity {
	@Column()
	name: string;

	@Column('double')
	price: number;

	@Column()
	status: boolean;

	@Column({ default: false })
	payment_status: boolean;

	@Column('text')
	caption: string;

	@OneToMany(() => FeatureEntity, (feature) => feature.plan, { cascade: true })
	features: FeatureEntity[];

	@OneToMany(() => ContextEntity, (context) => context.plan, { cascade: true })
	contexts: ContextEntity[];

	@OneToMany(() => MediaEntity, (media) => media.plan, {
		cascade: true,
	})
	medias: MediaEntity[];

	@ManyToOne(() => UserEntity, (user) => user.plans, {
		onDelete: 'CASCADE',
	})
	user: UserEntity;
}
