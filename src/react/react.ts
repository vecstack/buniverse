import type { ReactFormState } from 'react-dom/client';

export const ReactServer = {
  getRSCModule: async () => {
    return import.meta.viteRsc.loadModule<typeof import('./render-rsc.tsx')>('rsc');
  },
  renderRSC: async (request: Request, component: React.ReactNode) => {
    const rscModule = await ReactServer.getRSCModule();
    return rscModule.renderRSC(request, component);
  },
  renderSSR: async (
    rscStream: ReadableStream<Uint8Array>,
    options: {
      formState?: ReactFormState;
      nonce?: string;
      debugNojs?: boolean;
    },
  ) => {
    const ssrModule = await import.meta.viteRsc.loadModule<
      typeof import('./render-ssr.tsx')
    >('ssr', 'index');
    return ssrModule.renderSSR(rscStream, options);
  },
  fetchModule: async (modulePath: string) => {
    const rscModule = await import.meta.viteRsc.loadModule<
      typeof import('./render-rsc.tsx')
    >('rsc', 'index');
    return rscModule.fetchModule(/* @vite-ignore */ modulePath);
  },
};
