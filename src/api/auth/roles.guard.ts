import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../user/entities/user.entity';
import { ROLES_KEYS } from './roles.decorator';
import { Request } from 'express';
import { UserPayload } from '../../utils/user.payload';
import { UserService } from '../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private userService: UserService,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEYS,
			[context.getHandler(), context.getClass()],
		);
		const request: Request = context.switchToHttp().getRequest();
		const { id } = request.user as UserPayload;
		const userData = await this.userService.getUserById(id);
		if (!requiredRoles) return true;
		const hasPermission = userData.roles.some((role) =>
			requiredRoles.includes(role),
		);
		if (!hasPermission)
			throw new ForbiddenException('به این بخش دسترسی ندارید');
		return true;
	}
}
