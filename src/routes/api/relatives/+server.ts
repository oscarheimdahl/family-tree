import { supabase } from '$lib/server/supabaseClient';
import type { Relative } from '$lib/types/types';
import { json } from '@sveltejs/kit';
import fs from 'fs';

const UPDATE = false;

export async function GET() {
	if (UPDATE) insertRelativesFromFile();

	const res = await supabase.from('relatives').select('*');
	const relatives: Relative[] = res.data ?? [];
	relatives.sort((a, b) => a.id.localeCompare(b.id));
	return json(relatives);
}

function insertRelativesFromFile() {
	try {
		const relativesCSV = fs.readFileSync('./data/book1.csv', 'utf8');
		const relatives = parseRelatives(relativesCSV) ?? [];
		relatives.forEach((relative) => {
			supabase
				.from('relatives')
				.upsert({
					...relative,
					description: undefined
				})
				.then((res) => console.log(res));
		});
	} catch (err) {
		console.error(err);
	}
}

function parseRelatives(data: string) {
	const COMMA = ',';
	const relatives: Relative[] = [];

	const lines = data.split('\n');
	const headerLine = lines.splice(0, 1).at(0);
	if (!headerLine) return;
	const headers = headerLine.split(COMMA).map((header) => header.replace(/(\r\n|\n|\r)/gm, ''));
	lines.forEach((line) => {
		const words = line.split(COMMA);
		const newRelative: Relative = {
			id: '',
			firstname: '',
			lastname: '',
			childof: '',
			partnerto: '',
			description: ''
		};
		words.forEach((word, i) => {
			word = word.replace(/(\r\n|\n|\r)/gm, '');
			const header = headers.at(i);
			if (!word || !header) return;
			if (header === 'id') newRelative.id = word;
			else if (header === 'firstname') newRelative.firstname = word;
			else if (header === 'lastname') newRelative.lastname = word;
			else if (header === 'childof') newRelative.childof = word;
			else if (header === 'partnerto') newRelative.partnerto = word;
			else if (header === 'description') newRelative.description = word;
			else if (header === 'birthyear') newRelative.birthyear = +word;
			else if (header === 'generation') newRelative.generation = +word;
		});
		const isEmpty = Object.values(newRelative).every((x) => x === null || x === '');
		if (!isEmpty) relatives.push(newRelative);
	});
	return relatives;
}
