import { NotFound, parseRequest } from './utils/utils.js';
import { createFSRouter } from './packages/router/fs/index.js';
import { Server } from './server/server.js';


const port = 8080;
const router = await createFSRouter("./src/routes")
const publicDir = "../example/public"

console.log(router.formatRoutes?.());


export default async function handler(request: Request): Promise<Response> {
	const { pathname, verb } = parseRequest(request);
	const routeMatch = router.match(pathname);
	const verbModule = routeMatch?.getVerbModule(verb);

	if (!routeMatch || !verbModule) {
		return Server.runStaticServer(request, publicDir);
	}

	// Build a context object that will be passed to all request handlers and middlewares
	const context = Server.buildContext(request, routeMatch.context || {});

	return Server.runWithContext(context, async () => {
		// Run verb middlewares
		const routeMiddlewaresResponse = await Server.runRequestHandlers(request, verbModule.middlewares ?? []);
		if (routeMiddlewaresResponse) {
			return routeMiddlewaresResponse;
		}
		// Run the request handler for the matched route and verb
		const routeResponse = await Server.runRequestHandler(request, verbModule.handler);
		if (routeResponse) {
			return routeResponse;
		}

		return NotFound();
	});

}

