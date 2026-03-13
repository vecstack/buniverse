import react from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react(), rsc({})],

	environments: {
		rsc: {
			build: {
				rolldownOptions: {
					input: {
						index: './src/runnable.ts',
					},
				}
			}
		},
		ssr: {
			build: {
				rolldownOptions: {
					input: {
						index: './src/framework/entry.ssr.tsx'
					}
				}
			}
		},
		client: {
			build: {
				rolldownOptions: {
					input: {
						index: './src/framework/entry.client.tsx'
					}
				}
			},
		}
	}
})