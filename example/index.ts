import Cerelynn, { FSRouter } from 'cerelynn';

async function main() {
  await Cerelynn.bootstrap({
    router: FSRouter('src/routes'),
    public: 'public',
    port: 8000,
  });
}

main();
