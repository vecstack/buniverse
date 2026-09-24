import Buniverse from 'buniverse';
import { createFSRouter } from 'buniverse/router/fs';

async function main() {
  const router = await createFSRouter('./src/routes');

  const handler = await Buniverse.bootstrap({
    router,
    publicDir: './public',
  });

  Bun.serve({
    port: 8080,
    fetch: handler,
  });

  console.log('Server running on http://localhost:8080');
}

main();
