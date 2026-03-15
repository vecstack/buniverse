import { buniverse } from 'buniverse/plugin'
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
	plugins: [
		buniverse({
			server: './src/server.ts',
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		}
	}
})
