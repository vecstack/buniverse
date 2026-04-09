// src/framework/runtime.prod.ts
import type { FrameworkRuntime } from './runtime'

export async function createProdRuntime(): Promise<FrameworkRuntime> {
  // static imports — vite has already built these
  const [rscMod, ssrMod, clientMod] = await Promise.all([
    import('../../dist/rsc/index.js'),
    import('../../dist/ssr/index.js'),
    import('../../dist/client/index.js'),
  ])

  return {
    rsc: rscMod.default,
    ssr: ssrMod.default,
    client: clientMod.default,
  }
}