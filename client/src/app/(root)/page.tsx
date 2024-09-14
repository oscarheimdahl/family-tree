import { RelativeNodeType } from '@/types/types';

import App from './app';

export const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

export default async function Page() {
  const relativesResponse = await fetch(`${BACKEND}/api/relatives`);
  const relatives = (await relativesResponse.json()) as RelativeNodeType[];

  return <App serverRelatives={relatives}></App>;
}
