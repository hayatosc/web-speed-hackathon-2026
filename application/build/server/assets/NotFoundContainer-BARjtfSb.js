import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/utils/get_path.ts
function getImagePath(imageId) {
	return `/images/${imageId}.jpg`;
}
function getMoviePath(movieId) {
	return `/movies/${movieId}.gif`;
}
function getSoundPath(soundId) {
	return `/sounds/${soundId}.mp3`;
}
function getProfileImagePath(profileImageId) {
	return `/images/profiles/${profileImageId}.jpg`;
}
//#endregion
//#region src/utils/fetchers.ts
var HttpError = class extends Error {
	responseJSON;
	constructor(status, responseJSON, url) {
		super(`HTTP ${status} from ${url}`);
		this.responseJSON = responseJSON;
	}
};
async function throwIfNotOk(res, url) {
	if (res.ok) return;
	let body = null;
	try {
		body = await res.json();
	} catch {}
	throw new HttpError(res.status, body, url);
}
async function fetchBinary(url, signal) {
	const res = await fetch(url, { signal });
	await throwIfNotOk(res, url);
	return res.arrayBuffer();
}
async function fetchJSON(url, signal) {
	const res = await fetch(url, { signal });
	await throwIfNotOk(res, url);
	return res.json();
}
async function sendFile(url, file) {
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/octet-stream" },
		body: file
	});
	await throwIfNotOk(res, url);
	return res.json();
}
async function sendJSON(url, data) {
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	});
	await throwIfNotOk(res, url);
	return res.json();
}
//#endregion
//#region src/utils/format_long_date.ts
var longDateFormatter = new Intl.DateTimeFormat("ja-JP", {
	year: "numeric",
	month: "long",
	day: "numeric"
});
var shortTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: false
});
var SECOND = 1e3;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var MONTH = 30 * DAY;
var YEAR = 365 * DAY;
var withRelativeSuffix = (value, isFuture) => {
	return `${value}${isFuture ? "後" : "前"}`;
};
var formatLongDate = (value) => {
	return longDateFormatter.format(new Date(value));
};
var formatShortTime = (value) => {
	return shortTimeFormatter.format(new Date(value));
};
var formatRelativeTime = (value, now = Date.now()) => {
	const diff = new Date(value).getTime() - now;
	const absoluteDiff = Math.abs(diff);
	const isFuture = diff > 0;
	if (absoluteDiff < 45 * SECOND) return withRelativeSuffix("数秒", isFuture);
	if (absoluteDiff < 90 * SECOND) return withRelativeSuffix("1分", isFuture);
	if (absoluteDiff < 45 * MINUTE) return withRelativeSuffix(`${Math.round(absoluteDiff / MINUTE)}分`, isFuture);
	if (absoluteDiff < 90 * MINUTE) return withRelativeSuffix("1時間", isFuture);
	if (absoluteDiff < 22 * HOUR) return withRelativeSuffix(`${Math.round(absoluteDiff / HOUR)}時間`, isFuture);
	if (absoluteDiff < 36 * HOUR) return withRelativeSuffix("1日", isFuture);
	if (absoluteDiff < 26 * DAY) return withRelativeSuffix(`${Math.round(absoluteDiff / DAY)}日`, isFuture);
	if (absoluteDiff < 46 * DAY) return withRelativeSuffix("1か月", isFuture);
	if (absoluteDiff < 320 * DAY) return withRelativeSuffix(`${Math.round(absoluteDiff / MONTH)}か月`, isFuture);
	if (absoluteDiff < 548 * DAY) return withRelativeSuffix("1年", isFuture);
	return withRelativeSuffix(`${Math.round(absoluteDiff / YEAR)}年`, isFuture);
};
var toISOString = (value) => {
	return new Date(value).toISOString();
};
//#endregion
//#region src/components/application/NotFoundPage.tsx
var NotFoundPage = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen flex-col items-center justify-center px-4",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-4xl font-bold",
			children: "404"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-2 text-3xl",
			children: "Not Found"
		})]
	});
};
//#endregion
//#region src/containers/NotFoundContainer.tsx
var NotFoundContainer = () => {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("title", { children: "ページが見つかりません - CaX" }), /* @__PURE__ */ jsx(NotFoundPage, {})] });
};
//#endregion
export { toISOString as a, fetchJSON as c, getImagePath as d, getMoviePath as f, formatShortTime as i, sendFile as l, getSoundPath as m, formatLongDate as n, HttpError as o, getProfileImagePath as p, formatRelativeTime as r, fetchBinary as s, NotFoundContainer as t, sendJSON as u };
