import React from "react";
import type { RequestHandler } from "../router-adapter";
import { ReactServer } from "../react/react";


export const runRequestHandler = async (request: Request, handle: RequestHandler): Promise<Response | null> => {
	const result = await Promise.try(() => handle(request));
	if (!result) return null;

	if (React.isValidElement(result)) {
		return ReactServer.renderRSC(request, result);
	}

	return result;
}

export const runRequestHandlers = async (request: Request, handlers: RequestHandler[]): Promise<Response | null> => {
	for await (const handler of handlers) {
		return runRequestHandler(request, handler);
	}
	return null
}