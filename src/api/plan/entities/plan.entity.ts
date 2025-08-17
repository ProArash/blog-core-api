import { Column, Entity, OneToMany } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { ContextEntity } from './context.entity';
import { FeatureEntity } from './feature.entity';
import { MediaEntity } from '../../media/entities/media.entity';
import { InvoiceEntity } from '../../invoice/entities/invoice.entity';

@Entity()
export class PlanEntity extends FixedEntity {
	@Column()
	name: string;

	@Column('double')
	price: number;

	@Column()
	status: boolean;

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

	@OneToMany(() => InvoiceEntity, (invoice) => invoice.plan, { cascade: true })
	invoices: InvoiceEntity;
}
