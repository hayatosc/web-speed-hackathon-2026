import { jsx } from "react/jsx-runtime";
//#region src/components/foundation/FontAwesomeIcon.tsx
var FontAwesomeIcon = ({ iconType, styleType }) => {
	return /* @__PURE__ */ jsx("svg", {
		className: "font-awesome inline-block fill-current leading-none",
		children: /* @__PURE__ */ jsx("use", { xlinkHref: `/sprites/font-awesome/${styleType}.svg#${iconType}` })
	});
};
//#endregion
export { FontAwesomeIcon as t };
