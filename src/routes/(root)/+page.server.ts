/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch('/api/relatives');
	const relatives = await response.json();

	return {
		relatives
	};
}
