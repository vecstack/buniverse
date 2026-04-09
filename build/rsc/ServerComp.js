// @bun
// src/common/ServerComp.tsx
import { ClientComp } from "../client/ClientComp.js";
import { jsx, jsxs } from "react/jsx-runtime";
var ServerComp = () => {
  return /* @__PURE__ */ jsxs("div", {
    children: [
      "ServerComps",
      /* @__PURE__ */ jsx(ClientComp, {})
    ]
  });
};
export {
  ServerComp
};
