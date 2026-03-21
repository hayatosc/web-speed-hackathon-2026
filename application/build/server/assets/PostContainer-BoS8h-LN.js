import { n as __exportAll } from "./chunk-CNvmzFzq.js";
import { a as toISOString, c as fetchJSON, d as getImagePath, f as getMoviePath, m as getSoundPath, n as formatLongDate, p as getProfileImagePath, s as fetchBinary, t as NotFoundContainer } from "./NotFoundContainer-BARjtfSb.js";
import { t as FontAwesomeIcon } from "./FontAwesomeIcon-DFvxoWSs.js";
import { t as Button } from "./Button-BQKpEHAV.js";
import { Link, useLocation, useParams } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
//#region src/components/foundation/Link.tsx
var Link$1 = forwardRef(({ prefetch = "intent", ...props }, ref) => {
	return /* @__PURE__ */ jsx(Link, {
		ref,
		prefetch,
		...props
	});
});
Link$1.displayName = "Link";
//#endregion
//#region src/components/modal/Modal.tsx
var Modal = ({ className, children, ...props }) => {
	return /* @__PURE__ */ jsx("dialog", {
		className: classNames("backdrop:bg-cax-overlay/50 bg-cax-surface fixed inset-0 m-auto w-full max-w-[calc(min(var(--container-md),100%)-var(--spacing)*4)] rounded-lg p-4", className),
		...props,
		children
	});
};
//#endregion
//#region src/components/foundation/InfiniteScroll.tsx
var InfiniteScroll = ({ children, fetchMore, items }) => {
	const latestItem = items[items.length - 1];
	const lastRequestedItemRef = useRef(void 0);
	const requestMore = useCallback(() => {
		if (latestItem === void 0 || lastRequestedItemRef.current === latestItem) return;
		lastRequestedItemRef.current = latestItem;
		fetchMore();
	}, [fetchMore, latestItem]);
	useEffect(() => {
		let frameId = 0;
		const checkReachedBottom = () => {
			frameId = 0;
			if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 240) requestMore();
		};
		const scheduleCheck = () => {
			if (frameId !== 0) return;
			frameId = window.requestAnimationFrame(checkReachedBottom);
		};
		scheduleCheck();
		window.addEventListener("scroll", scheduleCheck, { passive: true });
		window.addEventListener("resize", scheduleCheck, { passive: true });
		return () => {
			window.removeEventListener("scroll", scheduleCheck);
			window.removeEventListener("resize", scheduleCheck);
			if (frameId !== 0) window.cancelAnimationFrame(frameId);
		};
	}, [requestMore]);
	useEffect(() => {
		if (latestItem === void 0) lastRequestedItemRef.current = void 0;
	}, [latestItem]);
	return /* @__PURE__ */ jsx(Fragment, { children });
};
//#endregion
//#region src/components/foundation/AspectRatioBox.tsx
/**
* 親要素の横幅を基準にして、指定したアスペクト比のブロック要素を作ります
*/
var AspectRatioBox = ({ aspectHeight, aspectWidth, children }) => {
	const ref = useRef(null);
	const [clientHeight, setClientHeight] = useState(0);
	useLayoutEffect(() => {
		const calcStyle = () => {
			setClientHeight((ref.current?.clientWidth ?? 0) / aspectWidth * aspectHeight);
		};
		calcStyle();
		const resizeObserver = new ResizeObserver(calcStyle);
		if (ref.current !== null) resizeObserver.observe(ref.current);
		return () => {
			resizeObserver.disconnect();
		};
	}, [aspectHeight, aspectWidth]);
	return /* @__PURE__ */ jsx("div", {
		ref,
		className: "relative h-1 w-full",
		style: { height: clientHeight },
		children: clientHeight !== 0 ? /* @__PURE__ */ jsx("div", {
			className: "absolute inset-0",
			children
		}) : null
	});
};
//#endregion
//#region src/components/foundation/CoveredImage.tsx
async function loadImageDescription(src) {
	const res = await fetch(src);
	if (!res.ok) return "";
	const data = await res.arrayBuffer();
	const [{ Buffer }, { ImageIFD, load }] = await Promise.all([import("buffer"), import("piexifjs")]);
	const raw = load(Buffer.from(data).toString("binary"))?.["0th"]?.[ImageIFD.ImageDescription];
	return raw != null ? new TextDecoder().decode(Buffer.from(raw, "binary")) : "";
}
/**
* アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
*/
var CoveredImage = ({ src }) => {
	const dialogId = useId();
	const [alt, setAlt] = useState(null);
	const [isLoadingAlt, setIsLoadingAlt] = useState(false);
	const handleDialogClick = useCallback((ev) => {
		ev.stopPropagation();
	}, []);
	const handleOpenAlt = useCallback(() => {
		if (alt !== null || isLoadingAlt) return;
		setIsLoadingAlt(true);
		loadImageDescription(src).then(setAlt).catch(() => setAlt("")).finally(() => setIsLoadingAlt(false));
	}, [
		alt,
		isLoadingAlt,
		src
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative h-full w-full overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("img", {
				alt: alt ?? "",
				className: "h-full w-full",
				decoding: "async",
				src,
				style: {
					inset: 0,
					objectFit: "cover",
					position: "absolute"
				}
			}),
			/* @__PURE__ */ jsx("button", {
				className: "border-cax-border bg-cax-surface-raised/90 text-cax-text-muted hover:bg-cax-surface absolute right-1 bottom-1 rounded-full border px-2 py-1 text-center text-xs",
				type: "button",
				command: "show-modal",
				commandfor: dialogId,
				onClick: handleOpenAlt,
				children: "ALT を表示する"
			}),
			/* @__PURE__ */ jsx(Modal, {
				id: dialogId,
				closedby: "any",
				onClick: handleDialogClick,
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid gap-y-6",
					children: [
						/* @__PURE__ */ jsx("h1", {
							className: "text-center text-2xl font-bold",
							children: "画像の説明"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm",
							children: isLoadingAlt ? "読み込み中..." : (alt ?? "") || "画像の説明はありません"
						}),
						/* @__PURE__ */ jsx(Button, {
							variant: "secondary",
							command: "close",
							commandfor: dialogId,
							children: "閉じる"
						})
					]
				})
			})
		]
	});
};
//#endregion
//#region src/components/post/ImageArea.tsx
var ImageArea = ({ images }) => {
	return /* @__PURE__ */ jsx(AspectRatioBox, {
		aspectHeight: 9,
		aspectWidth: 16,
		children: /* @__PURE__ */ jsx("div", {
			className: "border-cax-border grid h-full w-full grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-lg border",
			children: images.map((image, idx) => {
				return /* @__PURE__ */ jsx("div", {
					className: classNames("bg-cax-surface-subtle", {
						"col-span-1": images.length !== 1,
						"col-span-2": images.length === 1,
						"row-span-1": images.length > 2 && (images.length !== 3 || idx !== 0),
						"row-span-2": images.length <= 2 || images.length === 3 && idx === 0
					}),
					children: /* @__PURE__ */ jsx(CoveredImage, { src: getImagePath(image.id) })
				}, image.id);
			})
		})
	});
};
//#endregion
//#region src/hooks/use_fetch.ts
function useFetch(apiPath, fetcher, initialData) {
	const [result, setResult] = useState(() => ({
		data: initialData ?? null,
		error: null,
		isLoading: apiPath !== "" && initialData === void 0
	}));
	useEffect(() => {
		if (initialData !== void 0) return;
		if (apiPath === "") {
			setResult(() => ({
				data: null,
				error: null,
				isLoading: false
			}));
			return;
		}
		const controller = new AbortController();
		setResult(() => ({
			data: null,
			error: null,
			isLoading: true
		}));
		fetcher(apiPath, controller.signal).then((data) => {
			if (controller.signal.aborted) return;
			setResult((cur) => ({
				...cur,
				data,
				isLoading: false
			}));
		}, (error) => {
			if (controller.signal.aborted) return;
			setResult((cur) => ({
				...cur,
				error,
				isLoading: false
			}));
		});
		return () => {
			controller.abort();
		};
	}, [
		apiPath,
		fetcher,
		initialData
	]);
	return result;
}
//#endregion
//#region src/hooks/use_near_screen.ts
function useNearScreen({ once = true, rootMargin = "240px" } = {}) {
	const ref = useRef(null);
	const [isNearScreen, setIsNearScreen] = useState(false);
	useEffect(() => {
		if (once && isNearScreen) return;
		const element = ref.current;
		if (element == null) return;
		if (!("IntersectionObserver" in window)) {
			setIsNearScreen(true);
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				setIsNearScreen(true);
				if (once) observer.disconnect();
				return;
			}
			if (!once) setIsNearScreen(false);
		}, { rootMargin });
		observer.observe(element);
		return () => {
			observer.disconnect();
		};
	}, [
		isNearScreen,
		once,
		rootMargin
	]);
	return {
		isNearScreen,
		ref
	};
}
//#endregion
//#region src/components/foundation/PausableMovie.tsx
/**
* クリックすると再生・一時停止を切り替えます。
*/
var PausableMovie = ({ src }) => {
	const { isNearScreen, ref: containerRef } = useNearScreen();
	const { data, isLoading } = useFetch(isNearScreen ? src : "", fetchBinary);
	const animatorRef = useRef(null);
	const canvasElementRef = useRef(null);
	const canvasCallbackRef = useCallback((el) => {
		canvasElementRef.current = el;
	}, []);
	const [isPlaying, setIsPlaying] = useState(true);
	useEffect(() => {
		let isDisposed = false;
		const canvas = canvasElementRef.current;
		animatorRef.current?.stop();
		animatorRef.current = null;
		if (canvas === null || data === null) return;
		Promise.all([import("gifler"), import("omggif")]).then(([{ Animator, Decoder }, { GifReader }]) => {
			if (isDisposed || canvasElementRef.current !== canvas) return;
			const reader = new GifReader(new Uint8Array(data));
			const frames = Decoder.decodeFramesSync(reader);
			const animator = new Animator(reader, frames);
			animator.animateInCanvas(canvas);
			animator.onFrame(frames[0]);
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				setIsPlaying(false);
				animator.stop();
			} else {
				setIsPlaying(true);
				animator.start();
			}
			animatorRef.current = animator;
		});
		return () => {
			isDisposed = true;
			animatorRef.current?.stop();
			animatorRef.current = null;
		};
	}, [data]);
	const handleClick = useCallback(() => {
		setIsPlaying((isPlaying) => {
			if (isPlaying) animatorRef.current?.stop();
			else animatorRef.current?.start();
			return !isPlaying;
		});
	}, []);
	return /* @__PURE__ */ jsx("div", {
		ref: containerRef,
		className: "h-full w-full",
		children: /* @__PURE__ */ jsx(AspectRatioBox, {
			aspectHeight: 1,
			aspectWidth: 1,
			children: isLoading || data === null ? /* @__PURE__ */ jsx("div", {
				"aria-hidden": "true",
				className: "bg-cax-surface-subtle h-full w-full"
			}) : /* @__PURE__ */ jsxs("button", {
				"aria-label": "動画プレイヤー",
				className: "group relative block h-full w-full",
				onClick: handleClick,
				type: "button",
				"data-prevent-post-navigation": "true",
				children: [/* @__PURE__ */ jsx("canvas", {
					ref: canvasCallbackRef,
					className: "w-full"
				}), /* @__PURE__ */ jsx("div", {
					className: classNames("absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16 text-cax-surface-raised text-3xl bg-cax-overlay/50 rounded-full -translate-x-1/2 -translate-y-1/2", { "opacity-0 group-hover:opacity-100": isPlaying }),
					children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
						iconType: isPlaying ? "pause" : "play",
						styleType: "solid"
					})
				})]
			})
		})
	});
};
//#endregion
//#region src/components/post/MovieArea.tsx
var MovieArea = ({ movie }) => {
	return /* @__PURE__ */ jsx("div", {
		className: "border-cax-border bg-cax-surface-subtle relative h-full w-full overflow-hidden rounded-lg border",
		"data-movie-area": true,
		children: /* @__PURE__ */ jsx(PausableMovie, { src: getMoviePath(movie.id) })
	});
};
//#endregion
//#region src/components/foundation/SoundWaveSVG.tsx
async function calculate(data) {
	const AudioContextImpl = window.AudioContext ?? window.webkitAudioContext;
	if (AudioContextImpl === void 0) return {
		max: 0,
		peaks: []
	};
	const audioCtx = new AudioContextImpl();
	try {
		const buffer = await audioCtx.decodeAudioData(data.slice(0));
		const leftData = buffer.getChannelData(0);
		const rightData = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : leftData;
		const chunkSize = Math.max(1, Math.ceil(leftData.length / 100));
		let max = 0;
		const peaks = [];
		for (let start = 0; start < leftData.length; start += chunkSize) {
			const end = Math.min(start + chunkSize, leftData.length);
			let total = 0;
			for (let index = start; index < end; index += 1) total += (Math.abs(leftData[index] ?? 0) + Math.abs(rightData[index] ?? 0)) / 2;
			const peak = total / (end - start);
			peaks.push(peak);
			max = Math.max(max, peak);
		}
		return {
			max,
			peaks
		};
	} finally {
		audioCtx.close().catch(() => {});
	}
}
var SoundWaveSVG = ({ soundData }) => {
	const uniqueIdRef = useRef(Math.random().toString(16));
	const [{ max, peaks }, setPeaks] = useState({
		max: 0,
		peaks: []
	});
	useEffect(() => {
		calculate(soundData).then(({ max, peaks }) => {
			setPeaks({
				max,
				peaks
			});
		});
	}, [soundData]);
	return /* @__PURE__ */ jsx("svg", {
		className: "h-full w-full",
		preserveAspectRatio: "none",
		viewBox: "0 0 100 1",
		children: peaks.map((peak, idx) => {
			const ratio = peak / max;
			return /* @__PURE__ */ jsx("rect", {
				fill: "var(--color-cax-accent)",
				height: ratio,
				width: "1",
				x: idx,
				y: 1 - ratio
			}, `${uniqueIdRef.current}#${idx}`);
		})
	});
};
//#endregion
//#region src/components/foundation/SoundPlayer.tsx
var SoundPlayer = ({ sound }) => {
	const { isNearScreen, ref: containerRef } = useNearScreen();
	const { data, isLoading } = useFetch(isNearScreen ? getSoundPath(sound.id) : "", fetchBinary);
	const [blobUrl, setBlobUrl] = useState(null);
	useEffect(() => {
		if (data === null) {
			setBlobUrl(null);
			return;
		}
		const nextBlobUrl = URL.createObjectURL(new Blob([data]));
		setBlobUrl(nextBlobUrl);
		return () => {
			URL.revokeObjectURL(nextBlobUrl);
		};
	}, [data]);
	const [currentTimeRatio, setCurrentTimeRatio] = useState(0);
	const handleTimeUpdate = useCallback((ev) => {
		const el = ev.currentTarget;
		setCurrentTimeRatio(el.currentTime / el.duration);
	}, []);
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const handleTogglePlaying = useCallback(() => {
		setIsPlaying((isPlaying) => {
			if (isPlaying) audioRef.current?.pause();
			else audioRef.current?.play();
			return !isPlaying;
		});
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		ref: containerRef,
		className: "bg-cax-surface-subtle flex h-full w-full items-center justify-center",
		children: [
			blobUrl !== null ? /* @__PURE__ */ jsx("audio", {
				ref: audioRef,
				loop: true,
				onTimeUpdate: handleTimeUpdate,
				src: blobUrl
			}) : null,
			/* @__PURE__ */ jsx("div", {
				className: "p-2",
				children: isLoading || data === null || blobUrl === null ? /* @__PURE__ */ jsx("div", {
					"aria-hidden": "true",
					className: "bg-cax-text-subtle/20 h-8 w-8 rounded-full"
				}) : /* @__PURE__ */ jsx("button", {
					className: "bg-cax-accent text-cax-surface-raised flex h-8 w-8 items-center justify-center rounded-full text-sm hover:opacity-75",
					"data-prevent-post-navigation": "true",
					onClick: handleTogglePlaying,
					type: "button",
					children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
						iconType: isPlaying ? "pause" : "play",
						styleType: "solid"
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex h-full min-w-0 shrink grow flex-col pt-2",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap",
						children: sound.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-cax-text-muted overflow-hidden text-sm text-ellipsis whitespace-nowrap",
						children: sound.artist
					}),
					/* @__PURE__ */ jsx("div", {
						className: "pt-2",
						children: /* @__PURE__ */ jsx(AspectRatioBox, {
							aspectHeight: 1,
							aspectWidth: 10,
							children: isLoading || data === null || blobUrl === null ? /* @__PURE__ */ jsx("div", {
								"aria-hidden": "true",
								className: "bg-cax-text-subtle/10 h-full w-full rounded"
							}) : /* @__PURE__ */ jsxs("div", {
								className: "relative h-full w-full",
								children: [/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 h-full w-full",
									children: /* @__PURE__ */ jsx(SoundWaveSVG, { soundData: data })
								}), /* @__PURE__ */ jsx("div", {
									className: "bg-cax-surface-subtle absolute inset-0 h-full w-full opacity-75",
									style: { left: `${currentTimeRatio * 100}%` }
								})]
							})
						})
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/post/SoundArea.tsx
var SoundArea = ({ sound }) => {
	return /* @__PURE__ */ jsx("div", {
		className: "border-cax-border relative h-full w-full overflow-hidden rounded-lg border",
		"data-sound-area": true,
		children: /* @__PURE__ */ jsx(SoundPlayer, { sound })
	});
};
//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/usingCtx.js
function _usingCtx() {
	var r = "function" == typeof SuppressedError ? SuppressedError : function(r, e) {
		var n = Error();
		return n.name = "SuppressedError", n.error = r, n.suppressed = e, n;
	}, e = {}, n = [];
	function using(r, e) {
		if (null != e) {
			if (Object(e) !== e) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
			if (r) var o = e[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
			if (void 0 === o && (o = e[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r)) var t = o;
			if ("function" != typeof o) throw new TypeError("Object is not disposable.");
			t && (o = function o() {
				try {
					t.call(e);
				} catch (r) {
					return Promise.reject(r);
				}
			}), n.push({
				v: e,
				d: o,
				a: r
			});
		} else r && n.push({
			d: e,
			a: r
		});
		return e;
	}
	return {
		e,
		u: using.bind(null, !1),
		a: using.bind(null, !0),
		d: function d() {
			var o, t = this.e, s = 0;
			function next() {
				for (; o = n.pop();) try {
					if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
					if (o.d) {
						var r = o.d.call(o.v);
						if (o.a) return s |= 2, Promise.resolve(r).then(next, err);
					} else s |= 1;
				} catch (r) {
					return err(r);
				}
				if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
				if (t !== e) throw t;
			}
			function err(n) {
				return t = t !== e ? new r(n, t) : n, next();
			}
			return next();
		}
	};
}
//#endregion
//#region src/components/post/TranslatableText.tsx
var loadTranslator = () => import("./create_translator-hgr4cfbK.js");
var TranslatableText = ({ text }) => {
	const [state, updateState] = useState({
		type: "idle",
		text
	});
	const handleClick = useCallback(() => {
		switch (state.type) {
			case "idle":
				(async () => {
					updateState({ type: "loading" });
					try {
						try {
							var _usingCtx$1 = _usingCtx();
							const { createTranslator } = await loadTranslator();
							updateState({
								type: "translated",
								text: await _usingCtx$1.u(await createTranslator({
									sourceLanguage: "ja",
									targetLanguage: "en"
								})).translate(state.text),
								original: state.text
							});
						} catch (_) {
							_usingCtx$1.e = _;
						} finally {
							_usingCtx$1.d();
						}
					} catch {
						updateState({
							type: "translated",
							text: "翻訳に失敗しました",
							original: state.text
						});
					}
				})();
				break;
			case "translated":
				updateState({
					type: "idle",
					text: state.original
				});
				break;
			default:
				state.type;
				break;
		}
	}, [state]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", { children: state.type !== "loading" ? /* @__PURE__ */ jsx("span", { children: state.text }) : /* @__PURE__ */ jsx("span", {
		className: "bg-cax-surface-subtle text-cax-text-muted",
		children: text
	}) }), /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("button", {
		className: "text-cax-accent disabled:text-cax-text-subtle hover:underline disabled:cursor-default",
		disabled: state.type === "loading",
		"data-prevent-post-navigation": "true",
		onClick: handleClick,
		type: "button",
		children: [
			state.type === "idle" ? /* @__PURE__ */ jsx("span", { children: "Show Translation" }) : null,
			state.type === "loading" ? /* @__PURE__ */ jsx("span", { children: "Translating..." }) : null,
			state.type === "translated" ? /* @__PURE__ */ jsx("span", { children: "Show Original" }) : null
		]
	}) })] });
};
//#endregion
//#region src/hooks/use_infinite_fetch.ts
var LIMIT = 30;
function buildPaginatedApiPath(apiPath, limit, offset) {
	const url = new URL(apiPath, window.location.origin);
	url.searchParams.set("limit", String(limit));
	url.searchParams.set("offset", String(offset));
	return `${url.pathname}${url.search}`;
}
function useInfiniteFetch(apiPath, fetcher, initialData) {
	const skipFirstFetch = useRef(initialData !== void 0);
	const internalRef = useRef({
		controller: null,
		hasMore: apiPath !== "" && (initialData === void 0 || initialData.length === LIMIT),
		isLoading: false,
		offset: initialData?.length ?? 0
	});
	const [result, setResult] = useState(() => ({
		data: initialData ?? [],
		error: null,
		isLoading: apiPath !== "" && initialData === void 0
	}));
	const fetchMore = useCallback(() => {
		const { hasMore, isLoading, offset } = internalRef.current;
		if (apiPath === "" || !hasMore || isLoading) return;
		const controller = new AbortController();
		setResult((cur) => ({
			...cur,
			error: null,
			isLoading: true
		}));
		internalRef.current = {
			controller,
			hasMore,
			isLoading: true,
			offset
		};
		fetcher(buildPaginatedApiPath(apiPath, LIMIT, offset), controller.signal).then((pageData) => {
			if (controller.signal.aborted) return;
			setResult((cur) => ({
				...cur,
				data: [...cur.data, ...pageData],
				isLoading: false
			}));
			internalRef.current = {
				controller: null,
				hasMore: pageData.length === LIMIT,
				isLoading: false,
				offset: offset + pageData.length
			};
		}, (error) => {
			if (controller.signal.aborted) return;
			setResult((cur) => ({
				...cur,
				error,
				isLoading: false
			}));
			internalRef.current = {
				controller: null,
				hasMore,
				isLoading: false,
				offset
			};
		});
	}, [apiPath, fetcher]);
	useEffect(() => {
		internalRef.current.controller?.abort();
		if (apiPath === "") {
			setResult(() => ({
				data: [],
				error: null,
				isLoading: false
			}));
			internalRef.current = {
				controller: null,
				hasMore: false,
				isLoading: false,
				offset: 0
			};
			return;
		}
		if (skipFirstFetch.current) {
			skipFirstFetch.current = false;
			return () => {
				internalRef.current.controller?.abort();
			};
		}
		setResult(() => ({
			data: [],
			error: null,
			isLoading: true
		}));
		internalRef.current = {
			controller: null,
			hasMore: true,
			isLoading: false,
			offset: 0
		};
		fetchMore();
		return () => {
			internalRef.current.controller?.abort();
		};
	}, [fetchMore]);
	return {
		...result,
		fetchMore
	};
}
//#endregion
//#region src/components/post/CommentItem.tsx
var CommentItem = ({ comment }) => {
	return /* @__PURE__ */ jsx("article", {
		className: "hover:bg-cax-surface-subtle px-1 sm:px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "border-cax-border flex border-b px-2 pt-2 pb-4 sm:px-4",
			children: [/* @__PURE__ */ jsx("div", {
				className: "shrink-0 grow-0 pr-2 sm:pr-4",
				children: /* @__PURE__ */ jsx(Link$1, {
					className: "border-cax-border bg-cax-surface-subtle block h-8 w-8 overflow-hidden rounded-full border hover:opacity-75 sm:h-12 sm:w-12",
					to: `/users/${comment.user.username}`,
					children: /* @__PURE__ */ jsx("img", {
						alt: comment.user.profileImage.alt,
						src: getProfileImagePath(comment.user.profileImage.id)
					})
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 shrink grow",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "overflow-hidden text-xs text-ellipsis whitespace-nowrap",
						children: [/* @__PURE__ */ jsx(Link$1, {
							className: "text-cax-text pr-1 font-bold hover:underline",
							to: `/users/${comment.user.username}`,
							children: comment.user.name
						}), /* @__PURE__ */ jsxs(Link$1, {
							className: "text-cax-text-muted pr-1 hover:underline",
							to: `/users/${comment.user.username}`,
							children: ["@", comment.user.username]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-cax-text text-sm leading-relaxed",
						children: /* @__PURE__ */ jsx(TranslatableText, { text: comment.text })
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-cax-text-muted pt-1 text-xs",
						children: /* @__PURE__ */ jsx("time", {
							dateTime: toISOString(comment.createdAt),
							children: formatLongDate(comment.createdAt)
						})
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/components/post/CommentList.tsx
var CommentList = ({ comments }) => {
	return /* @__PURE__ */ jsx("div", { children: comments.map((comment) => {
		return /* @__PURE__ */ jsx(CommentItem, { comment }, comment.id);
	}) });
};
//#endregion
//#region src/components/post/PostItem.tsx
var PostItem = ({ post }) => {
	return /* @__PURE__ */ jsx("article", {
		className: "px-1 sm:px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "border-cax-border border-b px-4 pt-4 pb-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center",
				children: [/* @__PURE__ */ jsx("div", {
					className: "shrink-0 grow-0 pr-2",
					children: /* @__PURE__ */ jsx(Link$1, {
						className: "border-cax-border bg-cax-surface-subtle block h-14 w-14 overflow-hidden rounded-full border hover:opacity-95 sm:h-16 sm:w-16",
						to: `/users/${post.user.username}`,
						children: /* @__PURE__ */ jsx("img", {
							alt: post.user.profileImage.alt,
							src: getProfileImagePath(post.user.profileImage.id)
						})
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0 shrink grow overflow-hidden text-ellipsis whitespace-nowrap",
					children: [/* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Link$1, {
						className: "text-cax-text font-bold hover:underline",
						to: `/users/${post.user.username}`,
						children: post.user.name
					}) }), /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs(Link$1, {
						className: "text-cax-text-muted hover:underline",
						to: `/users/${post.user.username}`,
						children: ["@", post.user.username]
					}) })]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "pt-2 sm:pt-4",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-cax-text text-xl leading-relaxed",
						children: /* @__PURE__ */ jsx(TranslatableText, { text: post.text })
					}),
					post.images?.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "relative mt-2 w-full",
						children: /* @__PURE__ */ jsx(ImageArea, { images: post.images })
					}) : null,
					post.movie ? /* @__PURE__ */ jsx("div", {
						className: "relative mt-2 w-full",
						children: /* @__PURE__ */ jsx(MovieArea, { movie: post.movie })
					}) : null,
					post.sound ? /* @__PURE__ */ jsx("div", {
						className: "relative mt-2 w-full",
						children: /* @__PURE__ */ jsx(SoundArea, { sound: post.sound })
					}) : null,
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm sm:mt-4",
						children: /* @__PURE__ */ jsx(Link$1, {
							className: "text-cax-text-muted hover:underline",
							to: `/posts/${post.id}`,
							children: /* @__PURE__ */ jsx("time", {
								dateTime: toISOString(post.createdAt),
								children: formatLongDate(post.createdAt)
							})
						})
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/components/post/PostPage.tsx
var PostPage = ({ comments, post }) => {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PostItem, { post }), /* @__PURE__ */ jsx(CommentList, { comments })] });
};
//#endregion
//#region src/containers/PostContainer.tsx
var PostContainer_exports = /* @__PURE__ */ __exportAll({ PostContainer: () => PostContainer });
function getInitialPost(state, postId) {
	if (postId === void 0 || typeof state !== "object" || state === null || !("post" in state)) return null;
	const candidate = state.post;
	if (candidate == null || candidate.id !== postId) return null;
	return candidate;
}
var PostContainerContent = ({ postId, initialPost: loaderPost }) => {
	const statePost = getInitialPost(useLocation().state, postId);
	const seedPost = loaderPost ?? statePost ?? void 0;
	const { data: fetchedPost, isLoading: isLoadingPost } = useFetch(`/api/v1/posts/${postId}`, fetchJSON, seedPost);
	const post = fetchedPost ?? seedPost ?? null;
	const { data: comments, fetchMore } = useInfiniteFetch(`/api/v1/posts/${postId}/comments`, fetchJSON);
	if (isLoadingPost && post === null) return /* @__PURE__ */ jsx("title", { children: "読込中 - CaX" });
	if (post === null) return /* @__PURE__ */ jsx(NotFoundContainer, {});
	return /* @__PURE__ */ jsxs(InfiniteScroll, {
		fetchMore,
		items: comments,
		children: ["      ", /* @__PURE__ */ jsx(PostPage, {
			comments,
			post
		})]
	});
};
var PostContainer = ({ initialPost }) => {
	const { postId } = useParams();
	return /* @__PURE__ */ jsx(PostContainerContent, {
		postId,
		initialPost
	}, postId);
};
//#endregion
export { SoundArea as a, ImageArea as c, Link$1 as d, TranslatableText as i, InfiniteScroll as l, PostContainer_exports as n, MovieArea as o, useInfiniteFetch as r, useFetch as s, PostContainer as t, Modal as u };
