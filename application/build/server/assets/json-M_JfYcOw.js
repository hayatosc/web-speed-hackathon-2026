import { i as __toESM, t as __commonJSMin } from "./chunk-CNvmzFzq.js";
var json_default = (/* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	function json(hljs) {
		const LITERALS = { literal: "true false null" };
		const ALLOWED_COMMENTS = [hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE];
		const TYPES = [hljs.QUOTE_STRING_MODE, hljs.C_NUMBER_MODE];
		const VALUE_CONTAINER = {
			end: ",",
			endsWithParent: true,
			excludeEnd: true,
			contains: TYPES,
			keywords: LITERALS
		};
		const OBJECT = {
			begin: /\{/,
			end: /\}/,
			contains: [{
				className: "attr",
				begin: /"/,
				end: /"/,
				contains: [hljs.BACKSLASH_ESCAPE],
				illegal: "\\n"
			}, hljs.inherit(VALUE_CONTAINER, { begin: /:/ })].concat(ALLOWED_COMMENTS),
			illegal: "\\S"
		};
		const ARRAY = {
			begin: "\\[",
			end: "\\]",
			contains: [hljs.inherit(VALUE_CONTAINER)],
			illegal: "\\S"
		};
		TYPES.push(OBJECT, ARRAY);
		ALLOWED_COMMENTS.forEach(function(rule) {
			TYPES.push(rule);
		});
		return {
			name: "JSON",
			contains: TYPES,
			keywords: LITERALS,
			illegal: "\\S"
		};
	}
	module.exports = json;
})))())).default;
//#endregion
export { json_default as default };
