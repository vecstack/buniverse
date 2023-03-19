import { ContentType } from '../../types/routes.js';

export const parseBody = async (
  req: Request,
  contentType?: ContentType
): Promise<void | Response> => {
  if (!contentType) return;
  if (contentType === 'json') {
    try {
      await req.clone().json();
      return;
    } catch {
      return new Response(
        JSON.stringify({
          message: 'Invalid JSON',
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  if (contentType === 'form-data') {
    try {
      await req.clone().formData();
      return;
    } catch {
      return new Response(
        JSON.stringify({
          message: 'Invalid Form date',
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};
