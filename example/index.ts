import Buniverse from 'buniverse';
import { RouterManager } from 'buniverse/router';

async function main() {
  await Buniverse.bootstrap({
    router: await RouterManager.FSRouter('src/routes'),
    publicDir: 'public',
    port: 8080,
  });
}

main();
