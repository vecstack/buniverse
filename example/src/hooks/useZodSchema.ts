import { z } from 'zod';
import { useRequest } from 'buniverse';
export async function useZodSchema<T>(schema: z.ZodType<T>) {
  const request = useRequest();
  const contentType = request.headers.get('Content-Type');
  if (!contentType) throw new Response('Missing Content-Type');

  if (contentType.startsWith('application/json')) {
    try {
      const body = await request.json();
      const parsedBody = schema.safeParse(body);
      if (!parsedBody.success) {
        const formattedErrors = parsedBody.error.format();
        throw new Response(JSON.stringify(formattedErrors));
      }
      return parsedBody.data;
    } catch (error) {
      if (error instanceof Response) throw error;
      throw new Response('Invalid JSON');
    }
  }

  if (contentType.startsWith('multipart/form-data')) {
    try {
      const fd = await request.formData();
      const body = Object.fromEntries(fd.entries());
      const parsedBody = schema.safeParse(body);
      if (!parsedBody.success) {
        const errorMessages = parsedBody.error.errors
          .map((err) => err.message)
          .join(', ');
        throw new Response(errorMessages);
      }
      return parsedBody.data;
    } catch (error) {
      throw new Response('Invalid Form Data');
    }
  }

  throw new Error('Invalid Content-Type');
}
