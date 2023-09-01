export function formatFullName(firstname: string, lastname: string) {
	const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
	return (
		capitalizeFirstLetter(firstname.toLowerCase()) +
		' ' +
		capitalizeFirstLetter(lastname.toLowerCase())
	);
}
