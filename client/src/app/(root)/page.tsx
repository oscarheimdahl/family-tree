import { BACKEND } from '@/lib/vars';
import { ConnectionType, RelativeNodeType } from '@/types/types';

import { CanvasApp } from './CanvasApp';

export default async function Page() {
  const relatives = await getRelatives();
  const connections = await getConnections();

  return <CanvasApp serverRelatives={relatives} serverConnections={connections}></CanvasApp>;
}

async function getRelatives() {
  let relatives: RelativeNodeType[] = [];
  try {
    const relativesResponse = await fetch(`${BACKEND}/api/relatives`, {
      cache: 'no-store',
    });
    relatives = (await relativesResponse.json()) as RelativeNodeType[];
  } catch (e) {
    console.log(e);
  }
  return relatives;
}

async function getConnections() {
  let connections: ConnectionType[] = [];
  try {
    const connectionsResponse = await fetch(`${BACKEND}/api/connections`, {
      cache: 'no-store',
    });
    connections = (await connectionsResponse.json()) as ConnectionType[];
  } catch (e) {
    console.log(e);
  }
  return connections;
}
