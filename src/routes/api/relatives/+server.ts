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
		[
			'larsolof-pettersson',
			'larsolof-pettersson_larsolofwife',
			'larsolofwife',
			'larsolof-pettersson2',
			'albert-pettersson',
			'emma-pettersson',
			'augusta-pettersson',
			'augusta-pettersson_augustahusband',
			'augustahusband',
			'lenay',
			'lenay_lenayhusband',
			'lenayhusband',
			'lester',
			'lester_lesterwife',
			'lesterwife',
			'george',
			'chris',
			'cathy',
			'cathy_cathyhusband',
			'cathyhusband',
			'taylor',
			'patrick',
			'clyde',
			'clyde_clydewife',
			'clydewife',
			'robert',
			'howard',
			'larsolof-pettersson2_josefinaamalia-pettersson',
			'josefinaamalia-pettersson',
			'berta-pettersson',
			'josef-pettersson',
			'sigge-pettersson',
			'lambert-pettersson',
			'emil-pettersson',
			'manne-pettersson',
			'manne-pettersson_mannewife',
			'mannewife',
			'rune-pettersson',
			'rune-pettersson_kerstin-pettersson',
			'kerstin-pettersson',
			'johan-pettersson',
			'johan-pettersson_ingela-heimdahl',
			'ingela-heimdahl',
			'lina-heimdahl',
			'gustav-heimdahl',
			'oscar-heimdahl',
			'anna-heimdahl',
			'agnes-heimdahl',
			'elsa-heimdahl',
			'eva-pettersson',
			'eva-pettersson_prayadh-kullapa',
			'prayadh-kullapa',
			'åsa-kullapa',
			'åsa-kullapa_vince-alaras',
			'vince-alaras',
			'clara-kullapa',
			'alva-kullapa',
			'ella-kullapa',
			'malin-kullapa',
			'malin-kullapa_john-malmlund',
			'john-malmlund',
			'olive-kullapa',
			'zoe-kullapa',
			'dan-kullapa',
			'dan-kullapa_therese-vindahl',
			'therese-vindahl',
			'viola-kullapa',
			'baby-kullapa',
			'hanna-asp',
			'hanna-asp_petter-asp',
			'petter-asp',
			'ebba-asp',
			'ebba-asp_sebastian-lind',
			'sebastian-lind',
			'ted-asp',
			'erik-asp',
			'arvid-asp',
		].forEach((relative) => {
			console.log(relative);
			supabase
				.from('relatives')
				.upsert({
					id: relative,
				})
				.then((res) => {
					return console.log(relative, res);
				});
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
			description: '',
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
