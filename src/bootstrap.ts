import { Server } from './server/server';
import { HTTPVerb } from './router-adapter';
import { NotFound, parseRequest } from './utils/utils';
import type { Router } from './router-adapter';

export interface BootstrapOptions {
	router: Router
	publicDir?: string
}

export async function bootstrap(options: BootstrapOptions): Promise<(request: Request) => Promise<Response>> {
	const { router } = options;
	const publicDir = options.publicDir || './public';

	return async function handler(request: Request): Promise<Response> {
		const { pathname, verb } = parseRequest(request);
		const formattedPathname = pathname.replace(/\_.rsc$/, '');

		const includesRsc = pathname.includes('_.rsc');
		const routeMatch = router.match(formattedPathname);
		const verbModule = routeMatch?.getVerbModule(includesRsc ? HTTPVerb.GET : verb);

		if (!routeMatch || !verbModule) {
			return Server.runStaticServer(request, publicDir);
		}

		const context = Server.buildContext(request, routeMatch.context || {});

		return Server.runWithContext(context, async () => {
			const middlewareResponse = await Server.runRequestHandlers(request, verbModule.middlewares ?? []);
			if (middlewareResponse) return middlewareResponse;

			const routeResponse = await Server.runRequestHandler(request, verbModule.handler);
			if (routeResponse) return routeResponse;

			return NotFound();
		});
	};
}
