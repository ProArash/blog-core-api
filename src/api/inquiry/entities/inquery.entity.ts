import { Column, Entity, OneToMany } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { AttributeEntity } from './attribute.entity';

@Entity()
export class InquiryEntity extends FixedEntity {
	@Column()
	title: string;

	@Column('text')
	description: string;

	@Column()
	mobile: string;

	@Column()
	fullName: string;

	@Column()
	city: string;

	@Column()
	deadLine: number;

	@OneToMany(() => AttributeEntity, (attribute) => attribute.inquiry)
	attributes: AttributeEntity[];
}
