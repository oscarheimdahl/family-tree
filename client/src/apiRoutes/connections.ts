import { BACKEND } from '@/lib/vars';
import { ConnectionType } from '@/types/types';

export async function createConnectionBackend(connection: ConnectionType) {
  fetch(`${BACKEND}/api/connections`, {
    method: 'POST',
    body: JSON.stringify(connection),
  });
}
export async function deleteConnectionBackend(connectionId: string) {
  fetch(`${BACKEND}/api/connections/${connectionId}`, {
    method: 'DELETE',
  });
}
