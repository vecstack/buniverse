export type Interceptor<T> = (arg: T) => Response | void | Promise<Response | void>;
export type Handler = Interceptor<Request>;

export enum HTTPVerb {
	GET = "get",
	POST = "post",
	PUT = "put",
	PATCH = "patch",
	DELETE = "delete",
}

export type ContentType = "json" | "form-data";

export type RouteModule = {
	default?: Handler;
	middlewares?: Handler[];
	body?: ContentType;
};

export type MiddlewareModule = {
	default?: Handler;
};

export type Route = Partial<Record<HTTPVerb, RouteModule>> & {
	middlewares?: Handler[];
};

export type Routes = Record<string, Route>;