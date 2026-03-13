import type { ReactFormState } from "react-dom/client";

export type RscPayload = {
	root: React.ReactNode
	returnValue?: { ok: boolean; data: unknown }
	formState?: ReactFormState
}