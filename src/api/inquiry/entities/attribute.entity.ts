import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { InquiryEntity } from './inquery.entity';

@Entity()
export class AttributeEntity extends FixedEntity {
	@Column()
	title: string;

	@Column({
		nullable: true,
	})
	value: string;

	@ManyToOne(() => InquiryEntity, (inquiry) => inquiry.attributes, {
		onDelete: 'CASCADE',
	})
	inquiry: InquiryEntity;
}
