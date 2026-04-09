

import {parse} from "es-module-lexer"
import path from "node:path"
import * as ReactDOMServer from "react-server-dom-webpack/server.node" 


const clientEntries: string[] = []
const clientComponentsMap: Record<string, {
	id: string,
	name: string,
	chunk: string[],
	async: boolean,
}> = {}

function buildRsc() {
	return Bun.build({
		entrypoints: ["./src/common/ServerComp.tsx"],
		outdir: "./build/rsc",
		conditions: ["react-server"],
		target: "bun",
		format: "esm",
		packages: "external",
		plugins: [
			{
				name: "rsc-loader",
				setup(build) {
					build.onResolve({ filter: /\.tsx?$/ }, async (args) => {
						
						const modulePath = Bun.resolveSync(args.path, args.resolveDir)
						const file = Bun.file(modulePath)
						const contents = await file.text()
						if (contents.startsWith(`"use client"`) || contents.includes(`'use client'`)) {
							clientEntries.push(modulePath)
							return {
								path: modulePath.replace(/\.tsx?$/, ".js"),
								external: true,
							}
						}
					})
				},
			}
		]
	})
}

const buildClient = async () => {
	const clientBuild = await Bun.build({
		entrypoints: clientEntries,
		target: "bun",
		format: "esm",
		splitting: true,
		plugins: [],
		packages: "external",
	})

	const results = clientBuild.outputs.map(async (output) => {

		const modulePath = path.resolve("build/client", output.path )
		const contents = await output.text()
		const [, exports] = await parse(contents)

		for (const exp of exports) {
			const key = modulePath + exp.n
			clientComponentsMap[key] = {
				id: modulePath,
				name: exp.n,
				chunk: [],
				async: true
			}

			const newContents = contents + "\n" + `${exp.ln}.$$typeof = Symbol.for("react.client.reference")` + "\n" + `${exp.ln}.$$id = ${JSON.stringify(key)}`
			await Bun.write(modulePath, newContents)
		}
	})
	await Promise.all(results)
}

// await buildRsc()
// await buildClient()




const serverComponent = await import("../build/rsc/ServerComp.js")
const stream: ReadableStream = ReactDOMServer.renderToReadableStream(serverComponent.ServerComp, clientComponentsMap)

stream.pipeTo(new WritableStream({
	write(chunk) {
		console.log(new TextDecoder().decode(chunk))
	}
}))