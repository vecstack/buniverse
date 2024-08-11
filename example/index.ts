import Buniverse from 'buniverse';
import { createFSRouter } from 'buniverse/router/fs';

async function main() {
  Buniverse.bootstrap({
    router: await createFSRouter('src/routes'),
    publicDir: 'public',
    port: 8080,
  });
}

main();
