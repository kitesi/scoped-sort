// export const prerender = true;
export const load = ({ url }: { url: URL }) => {
	const currentRoute = url.pathname;

	return {
		currentRoute
	};
};
