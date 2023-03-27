import Atom from 'atom';

async function main() {
  await Atom.bootstrap({
    router: Atom.FSRouter('src/routes'),
    public: 'public',
    port: 8000,
  });
}

main();
