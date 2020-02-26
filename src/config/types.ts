export interface Jump {
	location: string,
	id: number;
	name: string;
}

export interface Page<T> {
	content: Array<T>;
	size: number; // page size
	number: number; // page count
	totalElements: number; // total items
	numberOfElements: number; // elements on page
}