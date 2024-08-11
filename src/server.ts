import { interceptors } from './plugins/plugins.js';
import { NotFound, parseRequest } from './utils/utils.js';
import serveStatic from 'serve-static-bun';
import { AsyncGlobalContext } from './context.js';
import type { Router } from './router-adapter.js';
import { InterceptorManager } from './interceptors/index.js';

export interface BootstrapConfig {
  publicDir: string;
  port?: number;
  router: Router;
}

export function bootstrap(config: BootstrapConfig) {
  const { port = 8080, router, publicDir } = config;

  async function handler(request: Request): Promise<Response> {
    const { pathname, verb } = parseRequest(request);
    const routeMatch = router.match(pathname);

    if (!routeMatch) {
      // @ts-ignore
      const response = await serveStatic(publicDir, { handleErrors: false })(request);
      if (response.status === 404) return NotFound();
      return response;
    }

    // Run request interceptors and throw if a response is returned
    const runWith = { request };
    routeMatch.context && Object.assign(runWith, routeMatch.context);

    const requestInterceptorsResponse = await AsyncGlobalContext.run(runWith, () => {
      return InterceptorManager.run(interceptors.request, request);
    });

    if (requestInterceptorsResponse) return requestInterceptorsResponse;

    // Get a route match for the current request
    const verbModule = routeMatch.getVerbModule(verb);
    if (!verbModule || !verbModule.default) return NotFound();
    const requestHandler = verbModule.default;
    const routeMiddlewares = routeMatch.getVerbMiddlewares(verb);

    const response = await AsyncGlobalContext.run(runWith, async () => {
      const interceptorsResponse = await InterceptorManager.run(routeMiddlewares, request);
      if (interceptorsResponse) return interceptorsResponse;
      const handlerResponse = await requestHandler(request);
      if (handlerResponse) return handlerResponse;
      return NotFound();
    });

    const interceptorsResponse = await AsyncGlobalContext.run(runWith, async () => {
      return await InterceptorManager.run(interceptors.response, response);
    });

    return interceptorsResponse || response;
  }
  Bun.serve({
    async fetch(request) {
      try {
        return await handler(request);
      } catch (error) {
        if (error instanceof Response) return error;
        throw error;
      }
    },
    port,
  });
  console.log('Listening on localhost:' + port);
}
