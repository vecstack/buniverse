import zod from 'zod';
import useRequest from './useRequest.js';

const useZod = async <T>(schema: zod.ZodType<T>) => {
  const request = useRequest();
  try {
    const json = await request.clone().json();
    return schema.parse(json);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Response(error.message, { status: 400 });
    }

    throw new Response('Invalid JSON', { status: 400 });
  }
};

export default useZod;
