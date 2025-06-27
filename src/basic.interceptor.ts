import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface BasicResponse {
	message: string;
	count: number;
}

@Injectable()
export class BasicInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<BasicResponse> {
		return next.handle().pipe(
			map((data: BasicResponse) => {
				let count = 0;
				console.log('interceptor log: ', data);

				if (Array.isArray(data)) {
					count = data.length;
				}
				return { ...data, count, message: 'ok' };
			}),
		);
	}
}
