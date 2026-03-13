import type { GlobalContext } from "./context";

export const buildContext = (request: Request, params: Record<string, string>): GlobalContext => {
	return { request, params };
}