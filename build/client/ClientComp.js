// @bun
// src/common/ClientComp.tsx
import { useState } from "react";

// src/common/update.ts
"use server";
var updateAction = async () => {
  return Math.floor(Math.random() * 100);
};

// src/common/ClientComp.tsx
import { jsx, jsxs } from "react/jsx-runtime";
"use client";
var ClientComp = () => {
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ jsxs("div", {
    children: [
      /* @__PURE__ */ jsxs("p", {
        children: [
          "Count: ",
          count
        ]
      }),
      /* @__PURE__ */ jsx("button", {
        onClick: () => setCount(count + 1),
        children: "Increment"
      }),
      /* @__PURE__ */ jsx("button", {
        onClick: async () => {
          try {
            const newVal = await updateAction();
            setCount(newVal);
          } catch (error) {
            console.error("Error calling updateAction:", error);
          }
        },
        children: "Decrement"
      })
    ]
  });
};
export {
  ClientComp
};

ClientComp.$$typeof = Symbol.for("react.client.reference")
ClientComp.$$id = "/Users/yousef/Desktop/oss/buniverse/build/client/ClientComp.jsClientComp"