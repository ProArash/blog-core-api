export interface ZibalNewUrlRequest {
	merchant: string;
	amount: number;
	callbackUrl: string;
	description: string;
	orderId: string;
}

export interface ZibalNewUrlResponse {
	trackId: number;
	result: number;
	message: string;
}

export interface ZibalVerifyResponse {
	merchant: string;
	trackId: number;
}
