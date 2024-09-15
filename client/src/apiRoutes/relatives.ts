import { BACKEND } from '@/lib/vars';
import { RelativeNodeType } from '@/types/types';

export async function updateRelativeBackend(relative: RelativeNodeType) {
  fetch(`${BACKEND}/api/relatives`, {
    method: 'PUT',
    body: JSON.stringify(relative),
  });
}

export async function createRelativeBackend(newRelative: RelativeNodeType) {
  fetch(`${BACKEND}/api/relatives`, {
    method: 'POST',
    body: JSON.stringify(newRelative),
  });
}
