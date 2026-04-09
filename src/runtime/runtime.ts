// src/framework/runtime.ts

export interface FrameworkRuntime {
  rsc(): Promise<typeof import('../react/render-rsc')>
  ssr(): Promise<typeof import('../react/render-ssr')>
	client(): Promise<typeof import('../react/render-client')>
}