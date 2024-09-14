import { relative } from 'path';

import { BACKEND } from '@/lib/vars';
import { RelativeNodeType } from '@/types/types';

import App from './app';

export default async function Page() {
  let relatives: RelativeNodeType[] = [];
  try {
    const relativesResponse = await fetch(`${BACKEND}/api/relatives`, {
      cache: 'no-store',
    });
    relatives = (await relativesResponse.json()) as RelativeNodeType[];
  } catch (e) {
    console.log(e);
  }

  console.log({ relatives });

  return <App serverRelatives={relatives}></App>;
}
