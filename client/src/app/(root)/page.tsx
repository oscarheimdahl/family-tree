'use client';

import App from './app';

const BACKEND = 'https://family-tree-backend.deno.dev';

export default async function Page() {
  const relativesResponse = await fetch(`${BACKEND}/api/relatives`);
  const relatives = await relativesResponse.json();

  return <App></App>;
}
