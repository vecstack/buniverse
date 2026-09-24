import { join } from 'path';

export const runStaticServer = async (request: Request, publicDir: string) => {
  const url = new URL(request.url);
  let filePath = join(publicDir, url.pathname);

  const file = Bun.file(filePath);

  return new Response(file);
};
