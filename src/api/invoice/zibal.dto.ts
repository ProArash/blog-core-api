export interface ZibalCreatePaymentRequest {
	merchant: string;
	amount: number;
	callbackUrl: string;
	description: string;
	orderId: string;
	mobile: string;
}
export interface ZibalCreatePaymentResponse {
	message: string;
	result: number;
	trackId: number;
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
	multiplexingInfos: [];
}
