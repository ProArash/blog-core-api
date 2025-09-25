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
	message: string;
	result: number;
	refNumber: string;
	paidAt: Date;
	status: number;
	amount: number;
	orderId: string;
	description: string;
	cardNumber: string;
	multiplexingInfos: string[];
}
