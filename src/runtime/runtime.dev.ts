// src/framework/runtime.dev.ts
import type { RunnableDevEnvironment, ViteDevServer } from 'vite'
import type { FrameworkRuntime } from './runtime'

export async function createDevRuntime(vite: ViteDevServer): Promise<FrameworkRuntime> {
  return {
    async rsc() {
			const rscEnv = vite.environments.rsc as RunnableDevEnvironment
      const mod = await rscEnv.runner.import('./src/framework/entry.rsc.tsx')
      return mod
    },
    async ssr() {
      const ssrEnv = vite.environments.ssr as RunnableDevEnvironment
      const mod = await ssrEnv.runner.import<typeof import('../react/render-ssr')>('./src/framework/entry.ssr.tsx')
      return mod
    },
		async client() {
			const clientEnv = vite.environments.client as RunnableDevEnvironment
			const mod = await clientEnv.runner.import<typeof import('../react/render-client')>('./src/framework/entry.client.tsx')
			return mod
		}
  }
}