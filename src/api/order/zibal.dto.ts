export interface ZibalVerifyResponse {
	message: string;
	result: number;
	refNumber: string;
	paidAt: string;
	status: number;
	amount: number;
	orderId: string;
	description: string;
	cardNumber: string;
	multiplexingInfos: [];
}

export interface ZibalVerifyRequest {
	trackId: number;
	merchant: string;
}

export interface ZibalCreatePayRequest {
	merchant: string;
	amount: number;
	callbackUrl: string;
	orderId: string;
}

export interface ZibalTrackIdResponse {
	message: string;
	result: number;
	trackId: string;
}

export interface IZibalVerifyResponse {
	message: string;
	result: number;
	refNumber: string;
	paidAt: string;
	status: number;
	amount: number;
	orderId: string;
	description: string;
	cardNumber: string;
	multiplexingInfos: string[];
}
