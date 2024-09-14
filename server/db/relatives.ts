import { z } from 'npm:zod';
import { _db } from './index.ts';

export const relativeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  x: z.number(),
  y: z.number(),
});

export type Relative = z.infer<typeof relativeSchema>;

export async function addRelative(relative: Relative) {
  const result = await _db.get(['relatives']);

  const relatives = (result.value ?? []) as Relative[];
  if (relatives.find((oldRelative) => oldRelative.id === relative.id)) {
    throw new Error('Relative already exists');
  }
  relatives.push(relative);

  await _db.set(['relatives'], relatives);
  console.log('Added relative: ', relative.name);
}

export async function getRelative(id: string) {
  const result = await _db.get(['relatives']);

  const relatives = (result.value ?? []) as Relative[];
  const relative = relatives.find((relative) => relative.id === id);
  return relative;
}

export async function getRelatives() {
  const result = await _db.get(['relatives']);

  console.log(result);

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

export async function updateRelative(relative: Partial<Relative>) {
  const result = await _db.get(['relatives']);

  const relatives = (result.value ?? []) as Relative[];
  const newRelatives = relatives.map((oldRelative) => {
    if (oldRelative.id === relative.id) {
      console.log({ relative });
      return relative;
    }
    return oldRelative;
  });

  await _db.set(['relatives'], newRelatives);
}
