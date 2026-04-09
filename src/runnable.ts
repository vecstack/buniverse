import { bootstrap } from './bootstrap';
import { createFSRouter } from './packages/router/fs/index';
import path from 'path';
import type { FrameworkRuntime } from './runtime/runtime';

const isProd = process.env.NODE_ENV === 'production'
const router = await createFSRouter('./src/routes');
let runtime: FrameworkRuntime

  if (isProd) {
    const { createProdRuntime } = await import('./runtime.prod')
    runtime = await createProdRuntime()
  } else {
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    const { createDevRuntime } = await import('./runtime.dev')
    runtime = await createDevRuntime(vite)
  }
const handler = await bootstrap({
  router,
  publicDir: path.resolve(process.cwd(), 'dist', 'client'),
});

Bun.serve({
  fetch: handler,
  port: 3000,
});

console.log('Server is running on http://localhost:3000');
