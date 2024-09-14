import { BACKEND } from '@/lib/vars';
import { RelativeNodeType } from '@/types/types';

import App from './app';

export default async function Page() {
  const relativesResponse = await fetch(`${BACKEND}/api/relatives`);
  const relatives = (await relativesResponse.json()) as RelativeNodeType[];

  return <App serverRelatives={relatives}></App>;
}
