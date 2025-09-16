import { IRole } from '../api/user/entities/role.entity';

export interface UserPayload {
	id: number;
	mobile: string;
	name: string;
	roles: IRole[];
}
