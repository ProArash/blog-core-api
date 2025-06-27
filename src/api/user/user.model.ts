import { Column, Entity } from 'typeorm';
import { FixedEntity } from '../utils/fixed.model';
import { UserRole } from '../utils/roles';

@Entity()
export class User extends FixedEntity {
	@Column({ default: 'no name' })
	name?: string;

	@Column({ unique: true })
	username: string;

	@Column({
		select: false,
	})
	password: string;

	@Column({
		type: 'simple-array',
	})
	roles: UserRole[];
}
