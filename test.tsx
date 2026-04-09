import {renderToReadableStream, registerClientReference} from "react-server-dom-webpack/server.edge" 
import {c} from "react-server-dom-webpack/client.browser" 

export const EditableText = registerClientReference(function() {throw new Error("Attempted to call EditableText() from the server but EditableText is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");},"/Users/yousef/Desktop/oss/buniverse/edit.tsx","ClientComp");
const stream: ReadableStream = renderToReadableStream(
	<div>
		<h1>Hello World</h1>
		<EditableText />
	</div>,
	{
		// client reference manifest is only needed if you use client references (like the EditableText above)
			"/Users/yousef/Desktop/oss/buniverse/edit.tsx": {
				"ClientComp": {
					id: "0",
					chunkIds: ["src_edit_tsx_ClientComp_jsx"],
					name: "ClientComp",
				}
			}
	}
)




stream.pipeTo(new WritableStream({
	write(chunk) {
		console.log(new TextDecoder().decode(chunk))
	}
}))

// 
