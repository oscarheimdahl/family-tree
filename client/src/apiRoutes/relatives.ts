import { BACKEND } from '@/lib/vars';
import { RelativeNodeType } from '@/types/types';

export async function updateRelativeBackend(relative: RelativeNodeType) {
  const res = await fetch(`${BACKEND}/api/relatives`, {
    method: 'PUT',
    body: JSON.stringify(relative),
  });
  if (!res.ok) throw new Error();
}

export async function createRelativeBackend(newRelative: RelativeNodeType) {
  fetch(`${BACKEND}/api/relatives`, {
    method: 'POST',
    body: JSON.stringify(newRelative),
  });
}
