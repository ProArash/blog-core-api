import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface IBasicResponse<T = undefined> {
	message?: string;
	count?: number;
	totalCount?: number;
	data?: T;
}

@Injectable()
export class BasicInterceptor<T>
	implements NestInterceptor<T, IBasicResponse<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<IBasicResponse<T>> {
		return next.handle().pipe(
			map((payload: T) => {
				let count: number | undefined = undefined;
				let totalCount: number | undefined = undefined;
				let responseData: T | undefined = payload;
				const newPayload = payload as IBasicResponse<T>;

				if (newPayload.totalCount) {
					totalCount = newPayload.totalCount;
					responseData = newPayload.data;
				} else {
					responseData = newPayload as T;
					if (Array.isArray(newPayload.data)) {
						count = newPayload.data.length;
					}
				}

				const noData = typeof payload == 'boolean';
				return {
					message: 'OK',
					count,
					totalCount,
					data: noData ? undefined : responseData,
				};
			}),
		);
	}
}
