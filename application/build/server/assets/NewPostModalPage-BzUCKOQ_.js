import { t as FontAwesomeIcon } from "./FontAwesomeIcon-DFvxoWSs.js";
import { n as ModalErrorMessage, t as ModalSubmitButton } from "./ModalSubmitButton-j9SThRzq.js";
import "./Button-BQKpEHAV.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useState } from "react";
import classNames from "classnames";
//#region src/components/new_post_modal/AttachFileInputButton.tsx
var AttachFileInputButton = ({ accept, active, icon, label, onChange }) => {
	return /* @__PURE__ */ jsxs("label", {
		className: "focus-within:outline-cax-brand relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full focus-within:outline-2 focus-within:outline-offset-2",
		children: [/* @__PURE__ */ jsx("span", {
			className: classNames("flex items-center justify-center w-12 h-12", {
				"bg-cax-surface-subtle": !active,
				"bg-cax-brand-soft": active
			}),
			children: icon
		}), /* @__PURE__ */ jsx("input", {
			multiple: true,
			accept,
			"aria-label": label,
			className: "sr-only",
			onChange,
			type: "file"
		})]
	});
};
//#endregion
//#region src/components/new_post_modal/NewPostModalPage.tsx
var MAX_UPLOAD_BYTES_LIMIT = 10 * 1024 * 1024;
var loadImageConverter = () => import("./convert_image-BLvjgnvz.js");
var loadMovieConverter = () => import("./convert_movie-BCT44d2d.js");
var loadSoundConverter = () => import("./convert_sound-BnAzObyV.js");
var NewPostModalPage = ({ id, hasError, isLoading, onResetError, onSubmit }) => {
	const [params, setParams] = useState({
		images: [],
		movie: void 0,
		sound: void 0,
		text: ""
	});
	const [hasFileError, setHasFileError] = useState(false);
	const [isConverting, setIsConverting] = useState(false);
	const handleChangeText = useCallback((ev) => {
		const value = ev.currentTarget.value;
		setParams((params) => ({
			...params,
			text: value
		}));
	}, []);
	const handleChangeImages = useCallback((ev) => {
		const files = Array.from(ev.currentTarget.files ?? []).slice(0, 4);
		const isValid = files.every((file) => file.size <= MAX_UPLOAD_BYTES_LIMIT);
		setHasFileError(isValid !== true);
		if (isValid) {
			setIsConverting(true);
			(async () => {
				try {
					const { convertImage } = await loadImageConverter();
					const convertedFiles = await Promise.all(files.map(async (file) => {
						const blob = await convertImage(file, { extension: "jpeg" });
						return new File([blob], "converted.jpg", { type: "image/jpeg" });
					}));
					setParams((params) => ({
						...params,
						images: convertedFiles,
						movie: void 0,
						sound: void 0
					}));
				} catch (error) {
					console.error(error);
				} finally {
					setIsConverting(false);
				}
			})();
		}
	}, []);
	const handleChangeSound = useCallback((ev) => {
		const file = Array.from(ev.currentTarget.files ?? [])[0];
		if (!file) return;
		const isValid = file.size <= MAX_UPLOAD_BYTES_LIMIT;
		setHasFileError(isValid !== true);
		if (isValid) {
			setIsConverting(true);
			(async () => {
				try {
					const { convertSound } = await loadSoundConverter();
					const converted = await convertSound(file, { extension: "mp3" });
					setParams((params) => ({
						...params,
						images: [],
						movie: void 0,
						sound: new File([converted], "converted.mp3", { type: "audio/mpeg" })
					}));
				} catch (error) {
					console.error(error);
				} finally {
					setIsConverting(false);
				}
			})();
		}
	}, []);
	const handleChangeMovie = useCallback((ev) => {
		const file = Array.from(ev.currentTarget.files ?? [])[0];
		if (!file) return;
		const isValid = file.size <= MAX_UPLOAD_BYTES_LIMIT;
		setHasFileError(isValid !== true);
		if (isValid) {
			setIsConverting(true);
			(async () => {
				try {
					const { convertMovie } = await loadMovieConverter();
					const converted = await convertMovie(file, {
						extension: "gif",
						size: void 0
					});
					setParams((params) => ({
						...params,
						images: [],
						movie: new File([converted], "converted.gif", { type: "image/gif" }),
						sound: void 0
					}));
				} catch (error) {
					console.error(error);
				} finally {
					setIsConverting(false);
				}
			})();
		}
	}, []);
	return /* @__PURE__ */ jsxs("form", {
		className: "grid gap-y-6",
		onSubmit: useCallback((ev) => {
			ev.preventDefault();
			onResetError();
			onSubmit(params);
		}, [
			params,
			onSubmit,
			onResetError
		]),
		children: [
			/* @__PURE__ */ jsx("h2", {
				id,
				className: "text-center text-2xl font-bold",
				children: "新規投稿"
			}),
			/* @__PURE__ */ jsx("textarea", {
				className: "border-cax-border placeholder-cax-text-subtle focus:outline-cax-brand w-full resize-none rounded-xl border px-3 py-2 focus:outline-2 focus:outline-offset-2",
				rows: 4,
				onChange: handleChangeText,
				placeholder: "いまなにしてる？"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "text-cax-text flex w-full items-center justify-evenly",
				children: [
					/* @__PURE__ */ jsx(AttachFileInputButton, {
						accept: "image/*",
						active: params.images.length !== 0,
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "images",
							styleType: "solid"
						}),
						label: "画像を添付",
						onChange: handleChangeImages
					}),
					/* @__PURE__ */ jsx(AttachFileInputButton, {
						accept: "audio/*",
						active: params.sound !== void 0,
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "music",
							styleType: "solid"
						}),
						label: "音声を添付",
						onChange: handleChangeSound
					}),
					/* @__PURE__ */ jsx(AttachFileInputButton, {
						accept: "video/*",
						active: params.movie !== void 0,
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "video",
							styleType: "solid"
						}),
						label: "動画を添付",
						onChange: handleChangeMovie
					})
				]
			}),
			/* @__PURE__ */ jsx(ModalSubmitButton, {
				disabled: isConverting || isLoading || params.text === "",
				loading: isConverting || isLoading,
				children: isConverting || isLoading ? "変換中" : "投稿する"
			}),
			/* @__PURE__ */ jsx(ModalErrorMessage, { children: hasFileError ? "10 MB より小さくしてください" : hasError ? "投稿ができませんでした" : null })
		]
	});
};
//#endregion
export { NewPostModalPage };
