import { UserRoles } from '../api/user/entities/user.entity';

export interface UserPayload {
	id: number;
	mobile: string;
	name: string;
	roles: UserRoles[];
}
