import { Blog } from '@/api/blog/entities/blog.entity';
import { FixedEntity } from '@/utils/entities/fixed.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum UserRole {
	ADMIN = 'Admin',
	USER = 'User',
}

@Entity()
export class User extends FixedEntity {
	@Column({
		nullable: true,
	})
	name: string;

	@Column({
		unique: true,
	})
	username: string;

	@Column({
		select: false,
	})
	password: string;

	@Column({
		select: false,
	})
	plainPassword: string;

	@Column('simple-array')
	roles: UserRole[];

	@OneToMany(() => Blog, (blog) => blog.user)
	blogs: Blog[];
}
