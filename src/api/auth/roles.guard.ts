// src/api/auth/roles.guard.ts

import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
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

		if (!requiredRoles) {
			return true;
		}

		const request: Request = context.switchToHttp().getRequest();

		if (!request.user) {
			throw new UnauthorizedException('User not authenticated');
		}

		const { id } = request.user as UserPayload;
		const userData = await this.userService.getUserById(id);

		const hasPermission = userData.roles.some((role) =>
			requiredRoles.includes(role),
		);

		if (!hasPermission) {
			throw new ForbiddenException('Insufficient permission');
		}

		return true;
	}
}
