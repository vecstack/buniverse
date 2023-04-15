import { parseBody } from './packages/router/body-parser.js';
import { runInterceptors, runMiddlewares } from './packages/router/middlewares.js';
import { Interceptor } from './types/routes.js';
import { BootstrapConfig, GlobalContext, PluginConfig } from './types/server.js';
import { NotFound, parseRequest } from './utils/utils.js';
import serveStatic from 'serve-static-bun';

export const globalContext: GlobalContext = {
  request: null,
  requestParams: {},
};

const reqInterceptors: Interceptor<Request>[] = [];
const resInterceptors: Interceptor<Response>[] = [];

export function install(pluginFn: () => PluginConfig) {
  const config = pluginFn();
  if (config.onRequest) reqInterceptors.push(config.onRequest);
  if (config.onResponse) resInterceptors.push(config.onResponse);
}

export async function bootstrap(config: BootstrapConfig) {
  const { port = 8080, router, publicDir } = config;

  async function handler(request: Request): Promise<Response> {
    globalContext.requestParams = {};
    globalContext.request = request;

    await runInterceptors(reqInterceptors, request);

    const { pathname, verb } = parseRequest(request)

    if (pathname === '/debug') return new Response(JSON.stringify(router.all, null, 2))
    const routeObject = router.match(pathname)


    if (!routeObject) {
      const response = await serveStatic(publicDir, { handleErrors: false })(request);
      if (response.status === 404) return NotFound();
      return response;
    }

    const { route, params } = routeObject;
    const verbModule = route[verb];
    if (!verbModule || !verbModule.default) return NotFound();
    const handler = verbModule.default;
    globalContext.requestParams = params;

    let response;
    try {
      response =
        (await parseBody(request, verbModule.body)) ||
        (await runMiddlewares(request, route)) ||
        (await handler(request)) ||
        NotFound();
    } catch (error) {

      if (error instanceof Response) response = error;
      else throw error;

    }

    await runInterceptors(resInterceptors, response);

    return response;
  }
  Bun.serve({
    async fetch(request) {
      return await handler(request);
    },
    port,
  });
  console.log('Listening on localhost:' + port);
}
