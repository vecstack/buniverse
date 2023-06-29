import { OriginalResponse } from './exports.js';

export class Response extends OriginalResponse {
  constructor(body?: BodyInit | object | null, init?: ResponseInit) {
    super();
    if (typeof body === 'object') {
      return new OriginalResponse(JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
        ...init,
      });
    }
    return new OriginalResponse(body, init);
  }
}
