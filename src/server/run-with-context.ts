import { AsyncGlobalContext, type GlobalContext } from "./context";

export const runWithContext = <T>(context: GlobalContext, callback: () => Promise<T> | T) => {
	return AsyncGlobalContext.run(context, callback);
}