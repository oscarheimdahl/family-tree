import z from 'npm:zod';
import { _db } from './index.ts';

export const connectionSchema = z.object({
  from: z.object({ parent1: z.string(), parent2: z.string() }).or(z.string()),
  to: z.string(),
});

export type Connection = z.infer<typeof connectionSchema>;
const connectionsKey = 'connections';

export async function addConnection(connection: Connection) {
  const result = await _db.get(['connections']);
  const connections = (result.value ?? []) as Connection[];
  connections.push(connection);

  await _db.set([connectionsKey], connections);
}

export async function getConnections() {
  const result = await _db.get([connectionsKey]);

  return result.value ?? [];
}

// export async function deleteRelative(id: string) {
//   const result = await _db.get([connectionsKey]);

//   const relatives = (result.value ?? []) as Relative[];
//   const newRelatives = relatives.filter((relative) => relative.id !== id);

//   await _db.set([connectionsKey], newRelatives);
// }

export async function deleteAllConnections() {
  await _db.delete([connectionsKey]);
}
