import Buniverse from 'buniverse';
import { FSRouter } from 'buniverse/router';

async function main() {
  await Buniverse.bootstrap({
    router: await FSRouter('src/routes'),
    publicDir: 'public',
    port: 8080,
  });
}

main();
