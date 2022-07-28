export interface Heading {
	name: string;
	content?: string;
	children?: {
		name: string;
		content: string;
		type: string;
		objectPropertyName: string;
		cliPropertyName: string;
	}[];
}
