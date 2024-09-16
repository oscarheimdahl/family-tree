import { BACKEND } from '@/lib/vars';
import { ConnectionType } from '@/types/types';

export async function createConnectionBackend(connection: ConnectionType) {
  const res = await fetch(`${BACKEND}/api/connections`, {
    method: 'POST',
    body: JSON.stringify(connection),
  });
  if (!res.ok) throw new Error();
}
export async function deleteConnectionBackend(connectionId: string) {
  const res = await fetch(`${BACKEND}/api/connections/${connectionId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error();
}
