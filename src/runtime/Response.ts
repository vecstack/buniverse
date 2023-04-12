import { OriginalResponse } from './exports.js';

export class Response extends OriginalResponse {
  constructor(body?: BodyInit | Record<string, unknown> | null, init?: ResponseInit) {
    super();
    if (typeof body === 'object') {
      return new Response(JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
        ...init,
      });
    }
    return new Response(body, init);
  }
}
