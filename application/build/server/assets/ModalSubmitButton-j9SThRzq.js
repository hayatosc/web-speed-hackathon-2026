import { t as FontAwesomeIcon } from "./FontAwesomeIcon-DFvxoWSs.js";
import { t as Button } from "./Button-BQKpEHAV.js";
import { jsx, jsxs } from "react/jsx-runtime";
import classNames from "classnames";
//#region src/components/modal/ModalErrorMessage.tsx
var ModalErrorMessage = ({ children }) => {
	return /* @__PURE__ */ jsxs("span", {
		className: classNames("block text-cax-danger", { hidden: !children }),
		children: [/* @__PURE__ */ jsx("span", {
			className: "mr-1",
			children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
				iconType: "exclamation-circle",
				styleType: "solid"
			})
		}), children]
	});
};
//#endregion
//#region src/components/modal/ModalSubmitButton.tsx
var ModalSubmitButton = ({ loading, leftItem, children, ...props }) => {
	return /* @__PURE__ */ jsx(Button, {
		type: "submit",
		leftItem: loading ? /* @__PURE__ */ jsx("span", {
			className: "animate-spin",
			children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
				iconType: "circle-notch",
				styleType: "solid"
			})
		}) : leftItem,
		...props,
		children
	});
};
//#endregion
export { ModalErrorMessage as n, ModalSubmitButton as t };
