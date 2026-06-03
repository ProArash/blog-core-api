import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface BasicResponse<T = undefined> {
	message?: string;
	count?: number;
	totalCount?: number;
	data?: T;
	pagination?: unknown;
}

@Injectable()
export class BasicInterceptor<T> implements NestInterceptor<
	T,
	BasicResponse<T>
> {
	private isBasicResponse(payload: unknown): payload is BasicResponse<T> {
		return !!payload && typeof payload === 'object' && 'data' in payload;
	}

	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<BasicResponse<T>> {
		return next.handle().pipe(
			map((payload: T) => {
				if (typeof payload === 'boolean') {
					return {
						message: 'OK',
					};
				}

				if (this.isBasicResponse(payload)) {
					return {
						message: payload.message ?? 'OK',
						count: payload.count,
						totalCount: payload.totalCount,
						data: payload.data,
						pagination: payload.pagination,
					};
				}

				return {
					message: 'OK',
					data: payload,
				};
			}),
		);
	}
}
