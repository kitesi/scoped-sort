export const load = ({ url }: { url: URL }) => {
	const currentRoute = url.pathname;

	return {
		currentRoute
	};
};

export const prerender = true;
