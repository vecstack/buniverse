import { z } from "zod";
import useRequest from "./useRequest.js";
export async function useSchema<T>(schema: z.ZodType<T>) {
	const request = useRequest();
	const contentType = request.headers.get("Content-Type")
	if (!contentType) throw new Response("Missing Content-Type");

	if (contentType.startsWith("application/json")) {
		let body;
		try {
			body = await request.json()
		} catch (error) {
			throw new Response("Invalid JSON");
		}
		return schema.parse(body);
	}

	if (contentType.startsWith("multipart/form-data")) {
		let fd;
		let body: Record<string, unknown> = {};
		try {
			fd = await request.formData()
			body = Object.fromEntries(fd.entries());
		} catch (error) {
			throw new Response("Invalid Form Data");
		}
		return schema.parse(body);
	}

	throw new Error("Invalid Content-Type");

}