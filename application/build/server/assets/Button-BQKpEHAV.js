import { jsx, jsxs } from "react/jsx-runtime";
import classNames from "classnames";
//#region src/components/foundation/Button.tsx
var Button = ({ variant = "primary", leftItem, rightItem, className, children, ...props }) => {
	return /* @__PURE__ */ jsxs("button", {
		className: classNames("flex items-center justify-center gap-2 rounded-full px-4 py-2 border", "disabled:opacity-50 disabled:cursor-not-allowed", {
			"bg-cax-brand text-cax-surface-raised hover:bg-cax-brand-strong border-transparent": variant === "primary",
			"bg-cax-surface text-cax-text-muted hover:bg-cax-surface-subtle border-cax-border": variant === "secondary"
		}, className),
		type: "button",
		...props,
		children: [
			leftItem,
			/* @__PURE__ */ jsx("span", { children }),
			rightItem
		]
	});
};
//#endregion
export { Button as t };
