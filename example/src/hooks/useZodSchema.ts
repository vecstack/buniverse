import { z } from 'zod';
import { useRequest } from 'buniverse';
export async function useZodSchema<T extends z.ZodTypeAny>(
  schema: T
): Promise<z.infer<T>> {
  const request = useRequest();
  const contentType = request.headers.get('Content-Type');
  if (!contentType)
    throw Response.json({ message: 'Content-Type is required' }, { status: 400 });

  if (contentType.startsWith('application/json')) {
    try {
      const body = await request.json();
      const parsedBody = schema.safeParse(body);
      if (!parsedBody.success) {
        const formattedErrors = parsedBody.error.format();
        throw Response.json(formattedErrors, { status: 400 });
      }
      return parsedBody.data;
    } catch (error) {
      if (error instanceof Response) throw error;
      throw Response.json({ message: 'Invalid JSON' }, { status: 400 });
    }
  }

  if (contentType.startsWith('multipart/form-data')) {
    try {
      const fd = await request.formData();
      const body = Object.fromEntries(fd.entries());
      const parsedBody = schema.safeParse(body);
      if (!parsedBody.success) {
        throw Response.json(parsedBody.error.format(), { status: 400 });
      }
      return parsedBody.data;
    } catch (error) {
      throw Response.json({ message: 'Invalid Form-Data' }, { status: 400 });
    }
  }

  throw new Error('Invalid Content-Type');
}
