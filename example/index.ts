import Buniverse from 'buniverse';
import { createFSRouter } from 'buniverse/router/fs';

async function main() {
  const router = await createFSRouter('src/routes')
  Buniverse.bootstrap({
    router: router,
    publicDir: 'public',
    port: 8080,
  });

  console.log(router.formatRoutes?.());

}

main();
