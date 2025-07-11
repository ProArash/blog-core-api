import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface BasicResponse<T = undefined> {
	message: string;
	count?: number;
	data?: T;
}

@Injectable()
export class BasicInterceptor<T>
	implements NestInterceptor<T, BasicResponse<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<BasicResponse<T>> {
		return next.handle().pipe(
			map((data: T) => {
				let count = 0;
				if (Array.isArray(data)) {
					count = data.length;
				}
				return { message: 'ok', count, data };
			}),
		);
	}
}
