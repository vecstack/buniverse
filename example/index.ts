import Cerelynn from 'cerelynn';
import { FSRouter } from 'cerelynn/router';

async function main() {
  await Cerelynn.bootstrap({
    routes: FSRouter('src/routes'),
    publicDir: 'public',
    port: 8080,
  });
}

main();
