import Buniverse, { RequestHandler } from 'buniverse';
import { RouterManager } from 'buniverse/router';

const HomeHandler: RequestHandler = () => {
  return new Response('Hello, world from JSX router!');
};

async function main() {
  Buniverse.bootstrap({
    router: await RouterManager.createFSRouter('src/routes'),
    publicDir: 'public',
    port: 8080,
  });
}

main();
