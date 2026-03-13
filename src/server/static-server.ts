import serveStatic from "serve-static-bun";
import { NotFound } from "../utils/utils";

export const runStaticServer = async (request: Request, publicDir: string) => {
	const response = await serveStatic(publicDir)(request);
	if (response.status === 404) return NotFound();
	return response;
}