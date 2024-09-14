import z from 'npm:zod';
import { _db } from './index.ts';

export const connectionSchema = z.object({
  source: z.object({ parent1: z.string(), parent2: z.string() }).or(z.string()),
  target: z.string(),
  id: z.string(),
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

export async function deleteConnection(id: string) {
  const result = await _db.get([connectionsKey]);

  const connections = (result.value ?? []) as Connection[];
  const newConnections = connections.filter(
    (connection) => connection.id !== id
  );

  await _db.set([connectionsKey], newConnections);
}

export async function deleteAllConnections() {
  await _db.delete([connectionsKey]);
}
