import React from "react";
import type { RequestHandler } from "../router-adapter";
import { renderRSC } from "../framework/entry.rsc";


export const runRequestHandler = async (request: Request, handle: RequestHandler): Promise<Response | null> => {
	const result = await Promise.try(() => handle(request));
	if (!result) return null;

	if (React.isValidElement(result)) {
		return renderRSC(request, result);
	}

	return result;
}

export const runRequestHandlers = async (request: Request, handlers: RequestHandler[]): Promise<Response | null> => {
	for await (const handler of handlers) {
		return runRequestHandler(request, handler);
	}
	return null
}