import { buildContext } from "./build-context";
import { AsyncGlobalContext } from "./context";
import { runRequestHandler, runRequestHandlers } from "./response-handler";
import { runWithContext } from "./run-with-context";
import { runStaticServer } from "./static-server";

export const Server = {
	runRequestHandler,
	runRequestHandlers,
	runStaticServer,
	runWithContext,
	buildContext,
	context: AsyncGlobalContext
}