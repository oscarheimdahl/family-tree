export const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function formatFullName(firstname: string, lastname: string) {
	return (
		capitalizeFirstLetter(firstname.toLowerCase()) +
		' ' +
		capitalizeFirstLetter(lastname.toLowerCase())
	);
}
