export async function GET() {
	return {
		headers: {
			Location: 'https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort'
		},
		status: 302
	};
}
