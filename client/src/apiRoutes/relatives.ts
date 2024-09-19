import { BACKEND } from '@/lib/vars';
import { RelativeNodeType } from '@/types/types';

export async function updateRelativeBackend(relative: RelativeNodeType) {
  const res = await fetch(`${BACKEND}/api/relatives`, {
    method: 'PUT',
    body: JSON.stringify(relative),
  });
  if (!res.ok) throw new Error();
}

export async function updateRelativesBackend(relatives: RelativeNodeType[]) {
  const res = await fetch(`${BACKEND}/api/relatives`, {
    method: 'PUT',
    body: JSON.stringify(relatives),
  });
  if (!res.ok) throw new Error();
}

export async function createRelativeBackend(newRelative: RelativeNodeType) {
  const res = await fetch(`${BACKEND}/api/relatives`, {
    method: 'POST',
    body: JSON.stringify(newRelative),
  });
  if (!res.ok) throw new Error();
}

export async function deleteRelativeBackend(relativeId: string) {
  const res = await fetch(`${BACKEND}/api/relatives/${relativeId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error();
}

export async function updateRelativeImageBackend(relativeId: string, image: File) {
  const formData = new FormData();
  formData.append('file', image);

  const res = await fetch(`${BACKEND}/api/relatives/${relativeId}/image`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error();
  const data = await res.json();
  return data;
}
