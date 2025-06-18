export interface ApiMeta {
	current_page: number;
	next_page: null | number; // null if no next page
	per_page: number;
	prev_page: null | number; // null if no previous page
	total_count: number;
	total_pages: number;
}

export interface ErrorResponse {
	data: never;
	error: {
		fields?: { error: string[]; field: string }[];
		message?: string;
	};
	status: 'error';
}

export type Response = ErrorResponse | SuccessResponse;

export interface SuccessResponse {
	data: unknown;
	error: never;
	meta?: ApiMeta;
	status: 'success';
}
