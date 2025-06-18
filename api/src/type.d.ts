import 'express';

declare global {
	namespace Express {
		export interface Locals {
			page: {
				limit: number;
				number: number;
				offset: number;
			};
		}
	}
}
