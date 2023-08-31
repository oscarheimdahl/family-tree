import fs from 'fs';

/** @type {import('./$types').PageLoad} */

export interface Relative {
	id: string;
	firstname: string;
	lastname: string;
	childOf: string;
	partnerTo: string;
	description: string;
}

export function load({ params }) {
	let data: string | undefined;
	try {
		data = fs.readFileSync('./data/book1.csv', 'utf8');
	} catch (err) {
		console.error(err);
	}
	if (!data) return;

	const relatives = parseRelatives(data) ?? [];
	return { relatives };
}

function parseRelatives(data: string) {
	const COMMA = ',';
	const relatives: Relative[] = [];

	const lines = data.split('\n');
	const headerLine = lines.splice(0, 1).at(0);
	if (!headerLine) return;
	const headers = headerLine.split(COMMA);
	lines.forEach((line) => {
		const words = line.split(COMMA);
		const newRelative: Relative = {
			id: '',
			firstname: '',
			lastname: '',
			childOf: '',
			partnerTo: '',
			description: ''
		};
		words.forEach((word, i) => {
			const header = headers.at(i);
			if (!word || !header) return;
			else if (header === 'id') newRelative.id = word;
			else if (header === 'firstname') newRelative.firstname = word;
			else if (header === 'lastname') newRelative.lastname = word;
			else if (header === 'childOf') newRelative.childOf = word;
			else if (header === 'partnerTo') newRelative.partnerTo = word;
			else if (header === 'description') newRelative.description = word;
		});
		const isEmpty = Object.values(newRelative).every((x) => x === null || x === '');
		if (!isEmpty) relatives.push(newRelative);
	});
	return relatives;
}
