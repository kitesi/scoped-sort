export interface OutlineItem {
	name: string;
	id: string;
	children: OutlineItem[];
	level: number;
}
