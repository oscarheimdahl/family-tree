import { z } from 'npm:zod';
import { _db } from './index.ts';

const relativeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Relative = z.infer<typeof relativeSchema>;

export async function addRelative(relative: unknown) {
  const parsedRelative = relativeSchema.parse(relative);

  const result = await _db.get(['relatives']);

  const relatives = (result.value ?? []) as Relative[];
  if (relatives.find((relative) => relative.id === parsedRelative.id)) {
    throw new Error('Relative already exists');
  }
  relatives.push(parsedRelative);

  await _db.set(['relatives'], relatives);
}

export async function getRelative(id: string) {
  const result = await _db.get(['relatives']);

  const relatives = (result.value ?? []) as Relative[];
  const relative = relatives.find((relative) => relative.id === id);
  return relative;
}

export async function getRelatives() {
  const result = await _db.get(['relatives']);

  return result.value ?? [];
}

export async function deleteRelative(id: string) {
  const result = await _db.get(['relatives']);

  const relatives = (result.value ?? []) as Relative[];
  const newRelatives = relatives.filter((relative) => relative.id !== id);

  await _db.set(['relatives'], newRelatives);
}

export async function deleteAllRelatives() {
  await _db.delete(['relatives']);
}
