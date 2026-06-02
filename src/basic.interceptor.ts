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
export class BasicInterceptor<T> implements NestInterceptor<
	T,
	IBasicResponse<T>
> {
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<IBasicResponse<T>> {
		return next.handle().pipe(
			map((payload: T) => {
				const count: number | undefined = undefined;
				const totalCount: number | undefined = undefined;
				const responseData: T | undefined = payload;

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
