import Atom from 'atom';

async function main() {
  await Atom.bootstrap({
    routes: await Atom.FSRouter('src/routes'),
    public: 'public',
    port: 8000,
  });
}

main();
