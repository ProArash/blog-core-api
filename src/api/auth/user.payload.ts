import { UserRole } from '../utils/roles';

export interface UserPayload {
	id?: number;
	username: string;
	roles: UserRole[];
}
