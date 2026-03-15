import type { PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface BuniverseOptions {
	server: string
}

export function buniverse(options: BuniverseOptions): PluginOption[] {
	const __dirname = path.dirname(fileURLToPath(import.meta.url))
	const reactDir = path.resolve(__dirname, '..', 'react')
	const clientEntry = path.resolve(reactDir, 'render-client.tsx')
	const ssrEntry = path.resolve(reactDir, 'render-ssr.tsx')
	const rscEntry = path.resolve(reactDir, 'render-rsc.tsx')

	const corePlugin: PluginOption = {
		name: 'buniverse',
		config() {
			return {
				resolve: {
					dedupe: ['react', 'react-dom', 'buniverse']
				},
				environments: {
					server: {
						build: {
							rolldownOptions: {
								input: {
									server: path.resolve(__dirname, "..", "..", options.server),
								},
							}
						}
					}
				}
			}
		},

	}

	return [
		react(),
		rsc({
			entries: {
				client: clientEntry,
				ssr: ssrEntry,
				rsc: rscEntry,
			},
			serverHandler: {
				entryName: 'server',
				environmentName: 'server',
			},
		}),
		corePlugin,
	]
}
