import { Column, Entity, OneToMany } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { DiscountEntity } from '../../discount/entities/discount.entity';
import { InvoiceEntity } from '../../invoice/entities/invoice.entity';

export enum UserRoles {
	USER = 'User',
	ADMIN = 'Admin',
	ROOT = 'Root',
}

@Entity()
export class UserEntity extends FixedEntity {
	@Column({
		nullable: true,
	})
	name: string;

	@Column({
		unique: true,
	})
	mobile: string;

	@Column({
		select: false,
	})
	password: string;

	@Column({
		select: false,
	})
	plainPassword: string;

	@Column({
		nullable: true,
	})
	otp: number;

	@Column('simple-array', {
		nullable: true,
	})
	roles: UserRoles[];

	@OneToMany(() => InvoiceEntity, (invoice) => invoice.user, { cascade: true })
	invoices: InvoiceEntity[];

	@OneToMany(() => DiscountEntity, (discount) => discount.user)
	discounts: DiscountEntity[];
}
