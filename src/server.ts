import { InterceptorManager } from './packages/middlewares/index.js';
import { ParserManager } from './packages/parsers/index.js';
import {
  BootstrapConfig,
  GlobalContext,
  Interceptors,
  PluginConfig,
} from './types/server.js';
import { NotFound, parseRequest } from './utils/utils.js';
import serveStatic from 'serve-static-bun';

export const globalContext: GlobalContext = {
  request: null,
  requestParams: {},
};

const interceptors: Interceptors = {
  request: [],
  response: [],
};

export function install(pluginFn: () => PluginConfig) {
  const config = pluginFn();
  if (config.onRequest) {
    interceptors.request.push(config.onRequest);
  }
  if (config.onResponse) {
    interceptors.response.push(config.onResponse);
  }
}

export async function bootstrap(config: BootstrapConfig) {
  const { port = 8080, router, publicDir } = config;

  async function handler(request: Request): Promise<Response> {
    globalContext.requestParams = {};
    globalContext.request = request;

    const requestInterceptorsResult = await InterceptorManager.run(
      interceptors.request,
      request
    );
    if (requestInterceptorsResult) return requestInterceptorsResult;

    const { pathname, verb } = parseRequest(request);

    if (pathname === '/debug')
      return new Response(JSON.stringify(router.routes, null, 2));
    const routeObject = router.match(pathname);

    if (!routeObject) {
      const response = await serveStatic(publicDir, { handleErrors: false })(request);
      if (response.status === 404) return NotFound();
      return response;
    }

    const { route, params } = routeObject;
    const routeModule = route[verb];
    if (!routeModule || !routeModule.default) return NotFound();

    const handler = routeModule.default;
    globalContext.requestParams = params;

    let response;
    try {
      const routeMiddlewares = InterceptorManager.getRouteMiddlewares(route, verb);
      response =
        (await ParserManager.parseRequestBody(request, routeModule.body)) ||
        (await InterceptorManager.run(routeMiddlewares, request)) ||
        (await handler(request)) ||
        NotFound();
    } catch (error) {
      if (error instanceof Response) response = error;
      else throw error;
    }

    const responseInterceptorResult = await InterceptorManager.run(
      interceptors.response,
      response
    );
    if (responseInterceptorResult) return responseInterceptorResult;

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
