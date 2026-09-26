import type { RequestHandler } from '../router/router-adapter';
import { join } from 'path';

const runStaticServer = async (request: Request, publicDir: string) => {
  const url = new URL(request.url);
  let filePath = join(publicDir, url.pathname);

  const file = Bun.file(filePath);

  return new Response(file);
};

const runRequestHandler = async (
  request: Request,
  handle: RequestHandler,
): Promise<Response | null> => {
  const result = await Promise.try(() => handle(request));
  if (!result) return null;

  return result;
};

const runRequestHandlers = async (
  request: Request,
  handlers: RequestHandler[],
): Promise<Response | null> => {
  for await (const handler of handlers) {
    return runRequestHandler(request, handler);
  }
  return null;
};

export const Server = {
  runRequestHandler,
  runRequestHandlers,
  runStaticServer,
};
