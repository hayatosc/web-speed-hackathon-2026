import { i as __toESM, n as __exportAll, r as __require, t as __commonJSMin } from "./assets/chunk-CNvmzFzq.js";
import { a as toISOString, c as fetchJSON, l as sendFile, n as formatLongDate, o as HttpError, p as getProfileImagePath, r as formatRelativeTime, t as NotFoundContainer, u as sendJSON } from "./assets/NotFoundContainer-BARjtfSb.js";
import { a as SoundArea, c as ImageArea, d as Link$1, i as TranslatableText, l as InfiniteScroll, o as MovieArea, r as useInfiniteFetch, s as useFetch, t as PostContainer, u as Modal } from "./assets/PostContainer-BoS8h-LN.js";
import { i as useWs, r as DirectMessageGate, t as DirectMessageContainer } from "./assets/DirectMessageContainer-BAp-B96y.js";
import { t as FontAwesomeIcon } from "./assets/FontAwesomeIcon-DFvxoWSs.js";
import { n as ModalErrorMessage, t as ModalSubmitButton } from "./assets/ModalSubmitButton-j9SThRzq.js";
import { t as Button } from "./assets/Button-BQKpEHAV.js";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, useLoaderData, useLocation, useNavigate, useOutletContext, useParams } from "react-router";
import { renderToReadableStream } from "react-dom/server";
import { isbot } from "isbot";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Suspense, isValidElement, lazy, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Provider } from "react-redux";
import classNames from "classnames";
import { legacy_createStore } from "redux";
import { FastAverageColor } from "fast-average-color";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
//#region app/entry.server.tsx
var entry_server_exports = /* @__PURE__ */ __exportAll({ default: () => handleRequest });
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext) {
	const stream = await renderToReadableStream(/* @__PURE__ */ jsx(ServerRouter, {
		context: routerContext,
		url: request.url
	}), { onError(error) {
		console.error(error);
		responseStatusCode = 500;
	} });
	if (isbot(request.headers.get("user-agent"))) await stream.allReady;
	responseHeaders.set("Content-Type", "text/html");
	return new Response(stream, {
		headers: responseHeaders,
		status: responseStatusCode
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({ default: () => root_default });
var root_default = UNSAFE_withComponentProps(function Root() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "ja",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", {
			className: "bg-cax-canvas text-cax-text",
			children: [
				/* @__PURE__ */ jsx("div", {
					id: "app",
					children: /* @__PURE__ */ jsx(Outlet, {})
				}),
				/* @__PURE__ */ jsx(ScrollRestoration, {}),
				/* @__PURE__ */ jsx(Scripts, {})
			]
		})]
	});
});
//#endregion
//#region src/components/application/AccountMenu.tsx
var AccountMenu = ({ user, onLogout }) => {
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative hidden lg:block lg:w-full lg:pb-2",
		onBlur: (e) => {
			if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
		},
		children: [open && /* @__PURE__ */ jsx("div", {
			className: "border-cax-border bg-cax-surface absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border py-1 shadow-lg",
			children: /* @__PURE__ */ jsx("button", {
				className: "text-cax-text hover:bg-cax-surface-subtle w-full px-4 py-3 text-left text-sm font-bold",
				onClick: () => {
					setOpen(false);
					onLogout();
				},
				children: "サインアウト"
			})
		}), /* @__PURE__ */ jsxs("button", {
			"aria-label": "アカウントメニュー",
			className: "hover:bg-cax-surface-subtle flex w-full items-center gap-3 rounded-full p-2 transition-colors",
			onClick: () => setOpen((prev) => !prev),
			children: [
				/* @__PURE__ */ jsx("img", {
					alt: user.profileImage.alt,
					className: "h-10 w-10 shrink-0 rounded-full object-cover",
					src: getProfileImagePath(user.profileImage.id)
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "hidden min-w-0 flex-1 text-left lg:block",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-cax-text truncate text-sm font-bold",
						children: user.name
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-cax-text-muted truncate text-sm",
						children: ["@", user.username]
					})]
				}),
				/* @__PURE__ */ jsx("span", {
					className: "text-cax-text-muted hidden lg:block",
					children: "···"
				})
			]
		})]
	});
};
//#endregion
//#region src/components/application/NavigationItem.tsx
var NavigationItem = ({ badge, href, icon, command, commandfor, text }) => {
	const isActive = useLocation().pathname === href;
	return /* @__PURE__ */ jsx("li", { children: href !== void 0 ? /* @__PURE__ */ jsxs(Link$1, {
		className: classNames("flex flex-col items-center justify-center w-12 h-12 hover:bg-cax-brand-soft rounded-full sm:px-2 sm:w-24 sm:h-auto sm:rounded-sm lg:flex-row lg:justify-start lg:px-4 lg:py-2 lg:w-auto lg:h-auto lg:rounded-full", { "text-cax-brand": isActive }),
		to: href,
		children: [/* @__PURE__ */ jsxs("span", {
			className: "relative text-xl lg:pr-2 lg:text-3xl",
			children: [icon, badge]
		}), /* @__PURE__ */ jsx("span", {
			className: "hidden sm:inline sm:text-sm lg:text-xl lg:font-bold",
			children: text
		})]
	}) : /* @__PURE__ */ jsxs("button", {
		className: "hover:bg-cax-brand-soft flex h-12 w-12 flex-col items-center justify-center rounded-full sm:h-auto sm:w-24 sm:rounded-sm sm:px-2 lg:h-auto lg:w-auto lg:flex-row lg:justify-start lg:rounded-full lg:px-4 lg:py-2",
		type: "button",
		command,
		commandfor,
		children: [/* @__PURE__ */ jsxs("span", {
			className: "relative text-xl lg:pr-2 lg:text-3xl",
			children: [icon, badge]
		}), /* @__PURE__ */ jsx("span", {
			className: "hidden sm:inline sm:text-sm lg:text-xl lg:font-bold",
			children: text
		})]
	}) });
};
//#endregion
//#region src/components/direct_message/DirectMessageNotificationBadge.tsx
var DirectMessageNotificationBadge = () => {
	const [unreadCount, updateUnreadCount] = useState(0);
	const displayCount = unreadCount > 99 ? "99+" : String(unreadCount);
	useWs("/api/v1/dm/unread", (event) => {
		updateUnreadCount(event.payload.unreadCount);
	});
	if (unreadCount === 0) return null;
	return /* @__PURE__ */ jsx("span", {
		className: "bg-cax-danger text-cax-surface-raised absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-xs font-bold",
		children: displayCount
	});
};
//#endregion
//#region src/components/foundation/CrokLogo.tsx
var CrokLogo = ({ className }) => /* @__PURE__ */ jsx("svg", {
	className,
	children: /* @__PURE__ */ jsx("use", { xlinkHref: "/images/icons/crok.svg#crok" })
});
//#endregion
//#region src/components/application/Navigation.tsx
var Navigation = ({ activeUser, authModalId, newPostModalId, onLogout }) => {
	return /* @__PURE__ */ jsx("nav", {
		className: "border-cax-border bg-cax-surface fixed right-0 bottom-0 left-0 z-10 h-12 border-t lg:relative lg:h-full lg:w-48 lg:border-t-0 lg:border-r",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative grid grid-flow-col items-center justify-evenly lg:fixed lg:flex lg:h-full lg:w-48 lg:flex-col lg:justify-between lg:p-2",
			children: [/* @__PURE__ */ jsxs("ul", {
				className: "grid grid-flow-col items-center justify-evenly lg:grid-flow-row lg:auto-rows-min lg:justify-start lg:gap-2",
				children: [
					/* @__PURE__ */ jsx(NavigationItem, {
						href: "/",
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "home",
							styleType: "solid"
						}),
						text: "ホーム"
					}),
					/* @__PURE__ */ jsx(NavigationItem, {
						href: "/search",
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "search",
							styleType: "solid"
						}),
						text: "検索"
					}),
					activeUser !== null ? /* @__PURE__ */ jsx(NavigationItem, {
						badge: /* @__PURE__ */ jsx(DirectMessageNotificationBadge, {}),
						href: "/dm",
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "envelope",
							styleType: "solid"
						}),
						text: "DM"
					}) : null,
					activeUser !== null ? /* @__PURE__ */ jsx(NavigationItem, {
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "edit",
							styleType: "solid"
						}),
						command: "show-modal",
						commandfor: newPostModalId,
						text: "投稿する"
					}) : null,
					activeUser !== null ? /* @__PURE__ */ jsx(NavigationItem, {
						href: `/users/${activeUser.username}`,
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "user",
							styleType: "solid"
						}),
						text: "マイページ"
					}) : null,
					activeUser === null ? /* @__PURE__ */ jsx(NavigationItem, {
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "sign-in-alt",
							styleType: "solid"
						}),
						text: "サインイン",
						command: "show-modal",
						commandfor: authModalId
					}) : null,
					activeUser !== null ? /* @__PURE__ */ jsx(NavigationItem, {
						href: "/crok",
						icon: /* @__PURE__ */ jsx(CrokLogo, { className: "h-[30px] w-[30px]" }),
						text: "Crok"
					}) : null,
					/* @__PURE__ */ jsx(NavigationItem, {
						href: "/terms",
						icon: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "balance-scale",
							styleType: "solid"
						}),
						text: "利用規約"
					})
				]
			}), activeUser !== null ? /* @__PURE__ */ jsx(AccountMenu, {
				user: activeUser,
				onLogout
			}) : null]
		})
	});
};
//#endregion
//#region src/components/application/AppPage.tsx
var AppPage = ({ activeUser, children, authModalId, newPostModalId, onLogout }) => {
	return /* @__PURE__ */ jsx("div", {
		className: "relative z-0 flex justify-center font-sans",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-cax-surface text-cax-text flex min-h-screen max-w-full",
			children: [/* @__PURE__ */ jsx("aside", {
				className: "relative z-10",
				children: /* @__PURE__ */ jsx(Navigation, {
					activeUser,
					authModalId,
					newPostModalId,
					onLogout
				})
			}), /* @__PURE__ */ jsx("main", {
				className: "relative z-0 w-screen max-w-screen-sm min-w-0 shrink pb-12 lg:pb-0",
				children
			})]
		})
	});
};
//#endregion
//#region src/auth/validation.ts
var validate$2 = (values) => {
	const errors = {};
	const normalizedName = values.name?.trim() || "";
	const normalizedPassword = values.password?.trim() || "";
	const normalizedUsername = values.username?.trim() || "";
	if (values.type === "signup" && normalizedName.length === 0) errors.name = "名前を入力してください";
	if ((/* @__PURE__ */ new RegExp("^(?:[^\\P{Letter}&&\\P{Number}]*){16,}$", "v")).test(normalizedPassword)) errors.password = "パスワードには記号を含める必要があります";
	if (normalizedPassword.length === 0) errors.password = "パスワードを入力してください";
	if (!/^[a-zA-Z0-9_]*$/.test(normalizedUsername)) errors.username = "ユーザー名に使用できるのは英数字とアンダースコア(_)のみです";
	if (normalizedUsername.length === 0) errors.username = "ユーザー名を入力してください";
	return errors;
};
//#endregion
//#region src/components/foundation/Input.tsx
var Input = ({ className, leftItem, rightItem, ...props }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "border-cax-border focus-within:outline-cax-brand flex items-center gap-2 rounded-full border px-4 py-2 focus-within:outline-2 focus-within:outline-offset-2",
		children: [
			leftItem,
			/* @__PURE__ */ jsx("input", {
				className: classNames("flex-1 placeholder-cax-text-subtle focus:outline-none", className),
				...props
			}),
			rightItem
		]
	});
};
//#endregion
//#region src/components/foundation/FormInputField.tsx
var FormInputField = ({ label, leftItem, rightItem, error, ...props }) => {
	const inputId = useId();
	const errorMessageId = useId();
	const isInvalid = Boolean(error);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-y-1",
		children: [
			/* @__PURE__ */ jsx("label", {
				className: "block text-sm",
				htmlFor: inputId,
				children: label
			}),
			/* @__PURE__ */ jsx(Input, {
				id: inputId,
				leftItem,
				rightItem,
				"aria-invalid": isInvalid || void 0,
				"aria-describedby": isInvalid ? errorMessageId : void 0,
				...props
			}),
			isInvalid && /* @__PURE__ */ jsxs("span", {
				className: "text-cax-danger text-xs",
				id: errorMessageId,
				children: [/* @__PURE__ */ jsx("span", {
					className: "mr-1",
					children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
						iconType: "exclamation-circle",
						styleType: "solid"
					})
				}), error]
			})
		]
	});
};
//#endregion
//#region src/hooks/use_form.ts
var getInitialStateKey = (values) => JSON.stringify(values);
var getTouchedState = (values) => {
	return Object.keys(values).reduce((accumulator, key) => {
		accumulator[key] = true;
		return accumulator;
	}, {});
};
var getErrorMessage = (error) => {
	if (error instanceof Error && error.message) return error.message;
	return "送信に失敗しました";
};
var useForm = ({ initialValues, onSubmit, validate }) => {
	const [values, setValues] = useState(initialValues);
	const [touched, setTouched] = useState({});
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState();
	useEffect(() => {
		setValues(initialValues);
		setTouched({});
		setHasSubmitted(false);
		setIsSubmitting(false);
		setSubmitError(void 0);
	}, [getInitialStateKey(initialValues)]);
	const errors = useMemo(() => validate(values), [validate, values]);
	const isInvalid = Object.keys(errors).length > 0;
	const setValue = (name, value) => {
		setValues((currentValues) => ({
			...currentValues,
			[name]: value
		}));
		setSubmitError(void 0);
	};
	const touch = (name) => {
		setTouched((currentTouched) => ({
			...currentTouched,
			[name]: true
		}));
	};
	const getInputProps = (name) => ({
		name: String(name),
		onBlur: () => {
			touch(name);
		},
		onChange: (event) => {
			setValue(name, event.currentTarget.value);
		},
		value: values[name]
	});
	const getFieldError = (name) => {
		if (!touched[name] && !hasSubmitted) return;
		return errors[name];
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setHasSubmitted(true);
		setTouched(getTouchedState(values));
		const validationErrors = validate(values);
		if (Object.keys(validationErrors).length > 0) return;
		setIsSubmitting(true);
		setSubmitError(void 0);
		try {
			await onSubmit(values);
		} catch (error) {
			setSubmitError(getErrorMessage(error));
		} finally {
			setIsSubmitting(false);
		}
	};
	return {
		getFieldError,
		getInputProps,
		handleSubmit,
		isInvalid,
		isSubmitting,
		setValue,
		submitError,
		values
	};
};
//#endregion
//#region src/components/auth_modal/AuthModalPage.tsx
var AuthModalPage = ({ onRequestCloseModal, onSubmit }) => {
	const { getFieldError, getInputProps, handleSubmit, isInvalid, isSubmitting, setValue, submitError, values } = useForm({
		initialValues: {
			name: "",
			password: "",
			type: "signin",
			username: ""
		},
		onSubmit,
		validate: validate$2
	});
	const type = values.type;
	return /* @__PURE__ */ jsxs("form", {
		className: "grid gap-y-6",
		onSubmit: handleSubmit,
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-center text-2xl font-bold",
				children: type === "signin" ? "サインイン" : "新規登録"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-center",
				children: /* @__PURE__ */ jsx("button", {
					className: "text-cax-brand underline",
					onClick: () => setValue("type", type === "signin" ? "signup" : "signin"),
					type: "button",
					children: type === "signin" ? "初めての方はこちら" : "サインインはこちら"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-y-2",
				children: [
					/* @__PURE__ */ jsx(FormInputField, {
						...getInputProps("username"),
						autoComplete: "username",
						error: getFieldError("username"),
						label: "ユーザー名",
						leftItem: /* @__PURE__ */ jsx("span", {
							className: "text-cax-text-subtle leading-none",
							children: "@"
						})
					}),
					type === "signup" && /* @__PURE__ */ jsx(FormInputField, {
						...getInputProps("name"),
						autoComplete: "nickname",
						error: getFieldError("name"),
						label: "名前"
					}),
					/* @__PURE__ */ jsx(FormInputField, {
						...getInputProps("password"),
						autoComplete: type === "signup" ? "new-password" : "current-password",
						error: getFieldError("password"),
						label: "パスワード",
						type: "password"
					})
				]
			}),
			type === "signup" ? /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(Link$1, {
				className: "text-cax-brand underline",
				onClick: onRequestCloseModal,
				to: "/terms",
				children: "利用規約"
			}), "に同意して"] }) : null,
			/* @__PURE__ */ jsx(ModalSubmitButton, {
				disabled: isSubmitting || isInvalid,
				loading: isSubmitting,
				children: type === "signin" ? "サインイン" : "登録する"
			}),
			/* @__PURE__ */ jsx(ModalErrorMessage, { children: submitError ?? null })
		]
	});
};
//#endregion
//#region src/containers/AuthModalContainer.tsx
var ERROR_MESSAGES = {
	INVALID_USERNAME: "ユーザー名に使用できない文字が含まれています",
	USERNAME_TAKEN: "ユーザー名が使われています"
};
function getErrorCode(err, type) {
	const responseJSON = err.responseJSON;
	if (typeof responseJSON !== "object" || responseJSON === null || !("code" in responseJSON) || typeof responseJSON.code !== "string" || !Object.keys(ERROR_MESSAGES).includes(responseJSON.code)) if (type === "signup") return "登録に失敗しました";
	else return "パスワードが異なります";
	return ERROR_MESSAGES[responseJSON.code];
}
var AuthModalContainer = ({ id, onUpdateActiveUser }) => {
	const ref = useRef(null);
	const [resetKey, setResetKey] = useState(0);
	useEffect(() => {
		if (!ref.current) return;
		const element = ref.current;
		const handleToggle = () => {
			setResetKey((key) => key + 1);
		};
		element.addEventListener("toggle", handleToggle);
		return () => {
			element.removeEventListener("toggle", handleToggle);
		};
	}, [ref, setResetKey]);
	const handleRequestCloseModal = useCallback(() => {
		ref.current?.close();
	}, [ref]);
	return /* @__PURE__ */ jsx(Modal, {
		id,
		ref,
		closedby: "any",
		children: /* @__PURE__ */ jsx(AuthModalPage, {
			onRequestCloseModal: handleRequestCloseModal,
			onSubmit: useCallback(async (values) => {
				try {
					if (values.type === "signup") onUpdateActiveUser(await sendJSON("/api/v1/signup", values));
					else onUpdateActiveUser(await sendJSON("/api/v1/signin", values));
					handleRequestCloseModal();
				} catch (err) {
					const error = getErrorCode(err instanceof HttpError ? err : new HttpError(0, null, ""), values.type);
					throw new Error(error);
				}
			}, [handleRequestCloseModal, onUpdateActiveUser])
		}, resetKey)
	});
};
//#endregion
//#region src/containers/NewPostModalContainer.tsx
async function sendNewPost({ images, movie, sound, text }) {
	return sendJSON("/api/v1/posts", {
		images: images ? await Promise.all(images.map((image) => sendFile("/api/v1/images", image))) : [],
		movie: movie ? await sendFile("/api/v1/movies", movie) : void 0,
		sound: sound ? await sendFile("/api/v1/sounds", sound) : void 0,
		text
	});
}
var LazyNewPostModalPage = lazy(async () => {
	const { NewPostModalPage } = await import("./assets/NewPostModalPage-BzUCKOQ_.js");
	return { default: NewPostModalPage };
});
var NewPostModalFallback = ({ id }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-y-6",
		children: [/* @__PURE__ */ jsx("h2", {
			id,
			className: "text-center text-2xl font-bold",
			children: "新規投稿"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-cax-text-muted text-center",
			children: "フォームを読み込んでいます..."
		})]
	});
};
var NewPostModalContainer = ({ id }) => {
	const dialogId = useId();
	const ref = useRef(null);
	const [hasOpened, setHasOpened] = useState(false);
	const [resetKey, setResetKey] = useState(0);
	useEffect(() => {
		const element = ref.current;
		if (element == null) return;
		const handleToggle = () => {
			if (element.open) setHasOpened(true);
			setResetKey((key) => key + 1);
		};
		element.addEventListener("toggle", handleToggle);
		return () => {
			element.removeEventListener("toggle", handleToggle);
		};
	}, []);
	const navigate = useNavigate();
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const handleResetError = useCallback(() => {
		setHasError(false);
	}, []);
	const handleSubmit = useCallback(async (params) => {
		try {
			setIsLoading(true);
			const post = await sendNewPost(params);
			ref.current?.close();
			navigate(`/posts/${post.id}`);
		} catch {
			setHasError(true);
		} finally {
			setIsLoading(false);
		}
	}, [navigate]);
	return /* @__PURE__ */ jsx(Modal, {
		"aria-labelledby": dialogId,
		id,
		ref,
		closedby: "any",
		children: hasOpened ? /* @__PURE__ */ jsx(Suspense, {
			fallback: /* @__PURE__ */ jsx(NewPostModalFallback, { id: dialogId }),
			children: /* @__PURE__ */ jsx(LazyNewPostModalPage, {
				id: dialogId,
				hasError,
				isLoading,
				onResetError: handleResetError,
				onSubmit: handleSubmit
			}, resetKey)
		}) : null
	});
};
//#endregion
//#region src/store/index.ts
var rootReducer = (state = {}) => state;
legacy_createStore(rootReducer);
function createAppStore() {
	return legacy_createStore(rootReducer);
}
//#endregion
//#region app/routes/_layout.tsx
var _layout_exports = /* @__PURE__ */ __exportAll({
	default: () => _layout_default,
	useLayoutOutletContext: () => useLayoutOutletContext
});
function useLayoutOutletContext() {
	return useOutletContext();
}
var _layout_default = UNSAFE_withComponentProps(function Layout() {
	const [store] = useState(() => createAppStore());
	const { pathname } = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		window.history.scrollRestoration = "manual";
	}, []);
	useLayoutEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	const [activeUser, setActiveUser] = useState(null);
	useEffect(() => {
		fetchJSON("/api/v1/me").then((user) => {
			setActiveUser(user);
		});
	}, []);
	const authModalId = useId();
	const newPostModalId = useId();
	return /* @__PURE__ */ jsxs(Provider, {
		store,
		children: [
			/* @__PURE__ */ jsx(AppPage, {
				activeUser,
				authModalId,
				newPostModalId,
				onLogout: useCallback(async () => {
					await sendJSON("/api/v1/signout", {});
					setActiveUser(null);
					navigate("/");
				}, [navigate]),
				children: /* @__PURE__ */ jsx(Outlet, { context: {
					activeUser,
					setActiveUser,
					authModalId
				} })
			}),
			/* @__PURE__ */ jsx(AuthModalContainer, {
				id: authModalId,
				onUpdateActiveUser: setActiveUser
			}),
			/* @__PURE__ */ jsx(NewPostModalContainer, { id: newPostModalId })
		]
	});
});
//#endregion
//#region src/components/timeline/TimelineItem.tsx
var isClickedAnchorOrButton = (target, currentTarget) => {
	while (target !== null && target instanceof Element) {
		const tagName = target.tagName.toLowerCase();
		if (tagName === "a" || tagName === "button") return true;
		if (currentTarget === target) return false;
		target = target.parentNode;
	}
	return false;
};
var TimelineItem = ({ post }) => {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsx("article", {
		className: "hover:bg-cax-surface-subtle px-1 sm:px-4",
		onClick: useCallback((ev) => {
			const isSelectedText = document.getSelection()?.isCollapsed === false;
			if (!isClickedAnchorOrButton(ev.target, ev.currentTarget) && !isSelectedText) navigate(`/posts/${post.id}`, { state: { post } });
		}, [post, navigate]),
		children: /* @__PURE__ */ jsxs("div", {
			className: "border-cax-border flex border-b px-2 pt-2 pb-4 sm:px-4",
			children: [/* @__PURE__ */ jsx("div", {
				className: "shrink-0 grow-0 pr-2 sm:pr-4",
				children: /* @__PURE__ */ jsx(Link, {
					className: "border-cax-border bg-cax-surface-subtle block h-12 w-12 overflow-hidden rounded-full border hover:opacity-75 sm:h-16 sm:w-16",
					to: `/users/${post.user.username}`,
					children: /* @__PURE__ */ jsx("img", {
						alt: post.user.profileImage.alt,
						src: getProfileImagePath(post.user.profileImage.id)
					})
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 shrink grow",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "overflow-hidden text-sm text-ellipsis whitespace-nowrap",
						children: [
							/* @__PURE__ */ jsx(Link, {
								className: "text-cax-text pr-1 font-bold hover:underline",
								to: `/users/${post.user.username}`,
								children: post.user.name
							}),
							/* @__PURE__ */ jsxs(Link, {
								className: "text-cax-text-muted pr-1 hover:underline",
								to: `/users/${post.user.username}`,
								children: ["@", post.user.username]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-cax-text-muted pr-1",
								children: "-"
							}),
							/* @__PURE__ */ jsx(Link, {
								className: "text-cax-text-muted pr-1 hover:underline",
								state: { post },
								to: `/posts/${post.id}`,
								children: /* @__PURE__ */ jsx("time", {
									dateTime: toISOString(post.createdAt),
									children: formatLongDate(post.createdAt)
								})
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-cax-text leading-relaxed",
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
					}) : null
				]
			})]
		})
	});
};
//#endregion
//#region src/components/timeline/Timeline.tsx
var Timeline = ({ timeline }) => {
	return /* @__PURE__ */ jsx("section", { children: timeline.map((post) => {
		return /* @__PURE__ */ jsx(TimelineItem, { post }, post.id);
	}) });
};
//#endregion
//#region src/components/timeline/TimelinePage.tsx
var TimelinePage = ({ timeline }) => {
	return /* @__PURE__ */ jsx(Timeline, { timeline });
};
//#endregion
//#region src/containers/TimelineContainer.tsx
var TimelineContainer = ({ initialPosts }) => {
	const { data: posts, fetchMore } = useInfiniteFetch("/api/v1/posts", fetchJSON, initialPosts);
	useEffect(() => {
		import("./assets/PostContainer-BoS8h-LN.js").then((n) => n.n);
	}, []);
	return /* @__PURE__ */ jsxs(InfiniteScroll, {
		fetchMore,
		items: posts,
		children: ["      ", /* @__PURE__ */ jsx(TimelinePage, { timeline: posts })]
	});
};
//#endregion
//#region app/routes/_index.tsx
var _index_exports = /* @__PURE__ */ __exportAll({
	default: () => _index_default,
	loader: () => loader$2,
	meta: () => meta$8
});
async function loader$2({ request }) {
	const origin = new URL(request.url).origin;
	return { posts: await fetch(`${origin}/api/v1/posts?limit=30&offset=0`).then((r) => r.json()) };
}
function meta$8() {
	return [{ title: "タイムライン - CaX" }];
}
var _index_default = UNSAFE_withComponentProps(function IndexRoute() {
	const { posts } = useLoaderData();
	return /* @__PURE__ */ jsx(TimelineContainer, { initialPosts: posts });
});
//#endregion
//#region src/components/direct_message/DirectMessageListPage.tsx
var DirectMessageListPage = ({ activeUser, conversations, error, newDmModalId }) => {
	if (conversations == null) return null;
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("header", {
		className: "border-cax-border flex flex-col gap-4 border-b px-4 pt-6 pb-4",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-bold",
			children: "ダイレクトメッセージ"
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap items-center gap-4",
			children: /* @__PURE__ */ jsx(Button, {
				command: "show-modal",
				commandfor: newDmModalId,
				leftItem: /* @__PURE__ */ jsx(FontAwesomeIcon, {
					iconType: "paper-plane",
					styleType: "solid"
				}),
				children: "新しくDMを始める"
			})
		})]
	}), error != null ? /* @__PURE__ */ jsx("p", {
		className: "text-cax-danger px-4 py-6 text-center text-sm",
		children: "DMの取得に失敗しました"
	}) : conversations.length === 0 ? /* @__PURE__ */ jsx("p", {
		className: "text-cax-text-muted px-4 py-6 text-center",
		children: "まだDMで会話した相手がいません。"
	}) : /* @__PURE__ */ jsx("ul", {
		"data-testid": "dm-list",
		children: conversations.map((conversation) => {
			const { messages } = conversation;
			const peer = conversation.initiator.id !== activeUser.id ? conversation.initiator : conversation.member;
			const lastMessage = messages.at(-1);
			const hasUnread = messages.filter((m) => m.sender.id === peer.id).some((m) => !m.isRead);
			return /* @__PURE__ */ jsx("li", {
				className: "grid",
				children: /* @__PURE__ */ jsx(Link$1, {
					className: "hover:bg-cax-surface-subtle px-4",
					to: `/dm/${conversation.id}`,
					children: /* @__PURE__ */ jsxs("div", {
						className: "border-cax-border flex gap-4 border-b px-4 pt-2 pb-4",
						children: [/* @__PURE__ */ jsx("img", {
							alt: peer.profileImage.alt,
							className: "w-12 shrink-0 self-start rounded-full",
							src: getProfileImagePath(peer.profileImage.id)
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-1 flex-col",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold",
										children: peer.name
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-cax-text-muted text-xs",
										children: ["@", peer.username]
									})] }), lastMessage != null && /* @__PURE__ */ jsx("time", {
										className: "text-cax-text-subtle text-xs",
										dateTime: toISOString(lastMessage.createdAt),
										children: formatRelativeTime(lastMessage.createdAt)
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 line-clamp-2 text-sm wrap-anywhere",
									children: lastMessage?.body
								}),
								hasUnread ? /* @__PURE__ */ jsx("span", {
									className: "bg-cax-brand-soft text-cax-brand mt-2 inline-flex w-fit rounded-full px-3 py-0.5 text-xs",
									children: "未読"
								}) : null
							]
						})]
					})
				})
			}, conversation.id);
		})
	})] });
};
//#endregion
//#region src/direct_message/validation.ts
var validate$1 = (values) => {
	const errors = {};
	if ((values.username?.trim().replace(/^@/, "") || "").length === 0) errors.username = "ユーザー名を入力してください";
	return errors;
};
//#endregion
//#region src/components/direct_message/NewDirectMessageModalPage.tsx
var NewDirectMessageModalPage = ({ id, onSubmit }) => {
	const { getFieldError, getInputProps, handleSubmit, isInvalid, isSubmitting, submitError } = useForm({
		initialValues: { username: "" },
		onSubmit,
		validate: validate$1
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-y-6",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-center text-2xl font-bold",
			children: "新しくDMを始める"
		}), /* @__PURE__ */ jsxs("form", {
			className: "flex flex-col gap-y-6",
			onSubmit: handleSubmit,
			children: [
				/* @__PURE__ */ jsx(FormInputField, {
					...getInputProps("username"),
					error: getFieldError("username"),
					label: "ユーザー名",
					leftItem: /* @__PURE__ */ jsx("span", {
						className: "text-cax-text-subtle leading-none",
						children: "@"
					}),
					placeholder: "username"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-y-2",
					children: [/* @__PURE__ */ jsx(ModalSubmitButton, {
						disabled: isSubmitting || isInvalid,
						loading: isSubmitting,
						children: "DMを開始"
					}), /* @__PURE__ */ jsx(Button, {
						variant: "secondary",
						command: "close",
						commandfor: id,
						children: "キャンセル"
					})]
				}),
				/* @__PURE__ */ jsx(ModalErrorMessage, { children: submitError ?? null })
			]
		})]
	});
};
//#endregion
//#region src/containers/NewDirectMessageModalContainer.tsx
var NewDirectMessageModalContainer = ({ activeUser, existingConversations, id }) => {
	const ref = useRef(null);
	const [resetKey, setResetKey] = useState(0);
	useEffect(() => {
		if (!ref.current) return;
		const element = ref.current;
		const handleToggle = () => {
			setResetKey((key) => key + 1);
		};
		element.addEventListener("toggle", handleToggle);
		return () => {
			element.removeEventListener("toggle", handleToggle);
		};
	}, [ref]);
	const navigate = useNavigate();
	return /* @__PURE__ */ jsx(Modal, {
		id,
		ref,
		closedby: "any",
		children: /* @__PURE__ */ jsx(NewDirectMessageModalPage, {
			id,
			onSubmit: useCallback(async (values) => {
				try {
					const normalizedUsername = values.username.trim().replace(/^@/, "");
					const existingConversation = existingConversations.find((conversation) => {
						return (conversation.initiator.id !== activeUser.id ? conversation.initiator : conversation.member).username === normalizedUsername;
					});
					if (existingConversation !== void 0) {
						navigate(`/dm/${existingConversation.id}`);
						return;
					}
					navigate(`/dm/${(await sendJSON(`/api/v1/dm?includeMessages=0`, { peerId: (await fetchJSON(`/api/v1/users/${normalizedUsername}`)).id })).id}`);
				} catch {
					throw new Error("ユーザーが見つかりませんでした");
				}
			}, [
				activeUser.id,
				existingConversations,
				navigate
			])
		}, resetKey)
	});
};
//#endregion
//#region src/containers/DirectMessageListContainer.tsx
var DirectMessageListContainer = ({ activeUser, authModalId }) => {
	const newDmModalId = useId();
	const [conversations, setConversations] = useState(null);
	const [error, setError] = useState(null);
	const loadConversations = useCallback(async () => {
		if (activeUser === null) return;
		try {
			setConversations(await fetchJSON("/api/v1/dm"));
			setError(null);
		} catch (nextError) {
			setConversations(null);
			setError(nextError);
		}
	}, [activeUser]);
	useEffect(() => {
		if (activeUser === null) {
			setConversations(null);
			setError(null);
			return;
		}
		loadConversations();
		import("./assets/DirectMessageContainer-BAp-B96y.js").then((n) => n.n);
	}, [activeUser, loadConversations]);
	useWs("/api/v1/dm/unread", () => {
		if (activeUser !== null) loadConversations();
	});
	if (activeUser === null) return /* @__PURE__ */ jsx(DirectMessageGate, {
		headline: "DMを利用するにはサインインが必要です",
		authModalId
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("title", { children: "ダイレクトメッセージ - CaX" }),
		/* @__PURE__ */ jsx(DirectMessageListPage, {
			activeUser,
			conversations,
			error,
			newDmModalId
		}),
		/* @__PURE__ */ jsx(NewDirectMessageModalContainer, {
			activeUser,
			existingConversations: conversations ?? [],
			id: newDmModalId
		})
	] });
};
//#endregion
//#region app/routes/dm._index.tsx
var dm__index_exports = /* @__PURE__ */ __exportAll({
	default: () => dm__index_default,
	meta: () => meta$7
});
function meta$7() {
	return [{ title: "ダイレクトメッセージ - CaX" }];
}
var dm__index_default = UNSAFE_withComponentProps(function DmIndexRoute() {
	const { activeUser, authModalId } = useLayoutOutletContext();
	return /* @__PURE__ */ jsx(DirectMessageListContainer, {
		activeUser,
		authModalId
	});
});
//#endregion
//#region app/routes/dm.$conversationId.tsx
var dm_$conversationId_exports = /* @__PURE__ */ __exportAll({
	default: () => dm_$conversationId_default,
	meta: () => meta$6
});
function meta$6() {
	return [{ title: "ダイレクトメッセージ - CaX" }];
}
var dm_$conversationId_default = UNSAFE_withComponentProps(function DmConversationRoute() {
	const { activeUser, authModalId } = useLayoutOutletContext();
	return /* @__PURE__ */ jsx(DirectMessageContainer, {
		activeUser,
		authModalId
	});
});
//#endregion
//#region src/search/services.ts
var sanitizeSearchText = (input) => {
	let text = input;
	text = text.replace(/\b(from|until)\s*:?\s*(\d{4}-\d{2}-\d{2})\d*/gi, (_m, key, date) => `${key}:${date}`);
	return text;
};
var parseSearchQuery = (query) => {
	const sincePattern = /since:((\d|\d\d|\d\d\d\d-\d\d-\d\d)+)+$/;
	const untilPattern = /until:((\d|\d\d|\d\d\d\d-\d\d-\d\d)+)+$/;
	const sincePart = query.match(/since:[^\s]*/)?.[0] || "";
	const untilPart = query.match(/until:[^\s]*/)?.[0] || "";
	const sinceMatch = sincePattern.exec(sincePart);
	const untilMatch = untilPattern.exec(untilPart);
	const keywords = query.replace(/since:.*(\d{4}-\d{2}-\d{2}).*/g, "").replace(/until:.*(\d{4}-\d{2}-\d{2}).*/g, "").trim();
	const extractDate = (s) => {
		if (!s) return null;
		const m = /(\d{4}-\d{2}-\d{2})/.exec(s);
		return m ? m[1] : null;
	};
	return {
		keywords,
		sinceDate: extractDate(sinceMatch ? sinceMatch[1] : null),
		untilDate: extractDate(untilMatch ? untilMatch[1] : null)
	};
};
var isValidDate = (dateStr) => {
	if (!/^(\d+)+-(\d+)+-(\d+)+$/.test(dateStr)) return false;
	const date = new Date(dateStr);
	return !Number.isNaN(date.getTime());
};
//#endregion
//#region src/search/validation.ts
var validate = (values) => {
	const errors = {};
	const raw = values.searchText?.trim() || "";
	if (!raw) {
		errors.searchText = "検索キーワードを入力してください";
		return errors;
	}
	const { keywords, sinceDate, untilDate } = parseSearchQuery(raw);
	if (!keywords && !sinceDate && !untilDate) {
		errors.searchText = "検索キーワードまたは日付範囲を指定してください";
		return errors;
	}
	if (sinceDate && !isValidDate(sinceDate)) {
		errors.searchText = `since: の日付形式が不正です: ${sinceDate}`;
		return errors;
	}
	if (untilDate && !isValidDate(untilDate)) {
		errors.searchText = `until: の日付形式が不正です: ${untilDate}`;
		return errors;
	}
	if (sinceDate && untilDate && new Date(sinceDate) > new Date(untilDate)) {
		errors.searchText = "since: は until: より前の日付を指定してください";
		return errors;
	}
	return errors;
};
//#endregion
//#region src/components/application/SearchPage.tsx
var SearchInput = ({ error, ...props }) => {
	const shouldShowError = Boolean(error);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-1 flex-col",
		children: [/* @__PURE__ */ jsx("input", {
			...props,
			className: `flex-1 rounded border px-4 py-2 focus:outline-none ${shouldShowError ? "border-cax-danger focus:border-cax-danger" : "border-cax-border focus:border-cax-brand-strong"}`,
			placeholder: "検索 (例: キーワード since:2025-01-01 until:2025-12-31)",
			type: "text"
		}), shouldShowError && /* @__PURE__ */ jsx("span", {
			className: "text-cax-danger mt-1 text-xs",
			children: error
		})]
	});
};
var SearchPage = ({ query, results, sentiment }) => {
	const navigate = useNavigate();
	const { getFieldError, getInputProps, handleSubmit } = useForm({
		initialValues: { searchText: query },
		onSubmit: (values) => {
			const sanitizedText = sanitizeSearchText(values.searchText.trim());
			navigate(`/search?q=${encodeURIComponent(sanitizedText)}`);
		},
		validate
	});
	const parsed = parseSearchQuery(query);
	const isNegative = sentiment?.label === "negative";
	const searchConditionText = useMemo(() => {
		const parts = [];
		if (parsed.keywords) parts.push(`「${parsed.keywords}」`);
		if (parsed.sinceDate) parts.push(`${parsed.sinceDate} 以降`);
		if (parsed.untilDate) parts.push(`${parsed.untilDate} 以前`);
		return parts.join(" ");
	}, [parsed]);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "bg-cax-surface p-4 shadow",
				children: [/* @__PURE__ */ jsx("form", {
					onSubmit: handleSubmit,
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx(SearchInput, {
							...getInputProps("searchText"),
							error: getFieldError("searchText")
						}), /* @__PURE__ */ jsx(Button, {
							variant: "primary",
							type: "submit",
							children: "検索"
						})]
					})
				}), /* @__PURE__ */ jsx("p", {
					className: "text-cax-text-muted mt-2 text-xs",
					children: "since:YYYY-MM-DD で開始日、until:YYYY-MM-DD で終了日を指定できます"
				})]
			}),
			query && /* @__PURE__ */ jsx("div", {
				className: "px-4",
				children: /* @__PURE__ */ jsxs("h2", {
					className: "text-lg font-bold",
					children: [
						searchConditionText,
						" の検索結果 (",
						results.length,
						" 件)"
					]
				})
			}),
			isNegative && /* @__PURE__ */ jsx("article", {
				className: "hover:bg-cax-surface-subtle px-1 sm:px-4",
				children: /* @__PURE__ */ jsx("div", {
					className: "border-cax-border flex border-b px-2 pt-2 pb-4 sm:px-4",
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-cax-text text-lg font-bold",
						children: "どしたん話聞こうか?"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-cax-text-muted",
						children: "言わなくてもいいけど、言ってもいいよ。"
					})] })
				})
			}),
			query && results.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "text-cax-text-muted flex items-center justify-center p-8",
				children: "検索結果が見つかりませんでした"
			}) : /* @__PURE__ */ jsx(Timeline, { timeline: results })
		]
	});
};
//#endregion
//#region src/hooks/use_search_params.ts
function useSearchParams() {
	const { search } = useLocation();
	return [useMemo(() => new URLSearchParams(search), [search])];
}
//#endregion
//#region src/containers/SearchContainer.tsx
var LIMIT = 30;
var SearchContainer = () => {
	const [searchParams] = useSearchParams();
	const query = searchParams.get("q") || "";
	const [searchResult, setSearchResult] = useState({
		posts: [],
		sentiment: null
	});
	const [visibleCount, setVisibleCount] = useState(0);
	useEffect(() => {
		if (!query) {
			setSearchResult({
				posts: [],
				sentiment: null
			});
			setVisibleCount(0);
			return;
		}
		const controller = new AbortController();
		setSearchResult({
			posts: [],
			sentiment: null
		});
		setVisibleCount(0);
		fetchJSON(`/api/v1/search?q=${encodeURIComponent(query)}`, controller.signal).then((result) => {
			if (controller.signal.aborted) return;
			setSearchResult(result);
			setVisibleCount(Math.min(LIMIT, result.posts.length));
		}, () => {
			if (controller.signal.aborted) return;
			setSearchResult({
				posts: [],
				sentiment: null
			});
			setVisibleCount(0);
		});
		return () => {
			controller.abort();
		};
	}, [query]);
	const posts = useMemo(() => searchResult.posts.slice(0, visibleCount), [searchResult.posts, visibleCount]);
	const fetchMore = () => {
		setVisibleCount((current) => {
			if (current >= searchResult.posts.length) return current;
			return Math.min(current + LIMIT, searchResult.posts.length);
		});
	};
	return /* @__PURE__ */ jsx(InfiniteScroll, {
		fetchMore,
		items: posts,
		children: /* @__PURE__ */ jsx(SearchPage, {
			query,
			results: posts,
			sentiment: searchResult.sentiment
		})
	});
};
//#endregion
//#region app/routes/search.tsx
var search_exports = /* @__PURE__ */ __exportAll({
	default: () => search_default,
	meta: () => meta$5
});
function meta$5() {
	return [{ title: "検索 - CaX" }];
}
var search_default = UNSAFE_withComponentProps(function SearchRoute() {
	return /* @__PURE__ */ jsx(SearchContainer, {});
});
//#endregion
//#region src/components/user_profile/UserProfileHeader.tsx
var UserProfileHeader = ({ user }) => {
	const [averageColor, setAverageColor] = useState(null);
	/** @type {React.ReactEventHandler<HTMLImageElement>} */
	const handleLoadImage = useCallback((ev) => {
		const fac = new FastAverageColor();
		const { rgb } = fac.getColor(ev.currentTarget, { mode: "precision" });
		setAverageColor(rgb);
		fac.destroy();
	}, []);
	return /* @__PURE__ */ jsxs("header", {
		className: "relative",
		children: [
			/* @__PURE__ */ jsx("div", { className: `h-32 ${averageColor ? `bg-[${averageColor}]` : "bg-cax-surface-subtle"}` }),
			/* @__PURE__ */ jsx("div", {
				className: "border-cax-border bg-cax-surface-subtle absolute left-2/4 m-0 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border sm:h-32 sm:w-32",
				children: /* @__PURE__ */ jsx("img", {
					alt: "",
					crossOrigin: "anonymous",
					onLoad: handleLoadImage,
					src: getProfileImagePath(user.profileImage.id)
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "px-4 pt-20",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold",
						children: user.name
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-cax-text-muted",
						children: ["@", user.username]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "pt-2",
						children: user.description
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-cax-text-muted pt-2 text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "pr-1",
							children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
								iconType: "calendar-alt",
								styleType: "regular"
							})
						}), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("time", {
							dateTime: toISOString(user.createdAt),
							children: formatLongDate(user.createdAt)
						}), "からサービスを利用しています"] })]
					})
				]
			})
		]
	});
};
//#endregion
//#region src/components/user_profile/UserProfilePage.tsx
var UserProfilePage = ({ timeline, user }) => {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(UserProfileHeader, { user }), /* @__PURE__ */ jsx("div", {
		className: "border-cax-border mt-6 border-t",
		children: /* @__PURE__ */ jsx(Timeline, { timeline })
	})] });
};
//#endregion
//#region src/containers/UserProfileContainer.tsx
var UserProfileContainer = ({ initialUser }) => {
	const { username } = useParams();
	const { data: user, isLoading: isLoadingUser } = useFetch(`/api/v1/users/${username}`, fetchJSON, initialUser);
	const { data: posts, fetchMore } = useInfiniteFetch(`/api/v1/users/${username}/posts`, fetchJSON);
	if (isLoadingUser) return /* @__PURE__ */ jsx("title", { children: "読込中 - CaX" });
	if (user === null) return /* @__PURE__ */ jsx(NotFoundContainer, {});
	return /* @__PURE__ */ jsxs(InfiniteScroll, {
		fetchMore,
		items: posts,
		children: ["      ", /* @__PURE__ */ jsx(UserProfilePage, {
			timeline: posts,
			user
		})]
	});
};
//#endregion
//#region app/routes/users.$username.tsx
var users_$username_exports = /* @__PURE__ */ __exportAll({
	default: () => users_$username_default,
	loader: () => loader$1,
	meta: () => meta$4
});
async function loader$1({ request, params }) {
	const origin = new URL(request.url).origin;
	return { user: await fetch(`${origin}/api/v1/users/${params.username}`).then((r) => r.json()) };
}
function meta$4({ data }) {
	if (!data?.user) return [{ title: "CaX" }];
	return [{ title: `${data.user.name} さんのタイムライン - CaX` }];
}
var users_$username_default = UNSAFE_withComponentProps(function UserProfileRoute() {
	const { user } = useLoaderData();
	return /* @__PURE__ */ jsx(UserProfileContainer, { initialUser: user });
});
//#endregion
//#region app/routes/posts.$postId.tsx
var posts_$postId_exports = /* @__PURE__ */ __exportAll({
	default: () => posts_$postId_default,
	loader: () => loader,
	meta: () => meta$3
});
async function loader({ request, params }) {
	const origin = new URL(request.url).origin;
	return { post: await fetch(`${origin}/api/v1/posts/${params.postId}`).then((r) => r.json()) };
}
function meta$3({ data }) {
	if (!data?.post) return [{ title: "CaX" }];
	return [{ title: `${data.post.user.name} さんのつぶやき - CaX` }];
}
var posts_$postId_default = UNSAFE_withComponentProps(function PostRoute() {
	const { post } = useLoaderData();
	return /* @__PURE__ */ jsx(PostContainer, { initialPost: post });
});
//#endregion
//#region src/components/term/TermPage.tsx
var TermPage = () => {
	return /* @__PURE__ */ jsxs("article", {
		className: "px-2 pb-16 leading-relaxed md:px-4 md:pt-2",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-3xl leading-[normal] font-bold",
				children: "利用規約"
			}),
			/* @__PURE__ */ jsx("p", { children: "この利用規約（以下、「本規約」といいます。）は、株式会社\xA0架空の会社（以下、「当社」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。" }),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第1条（適用）"
			}),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [
					/* @__PURE__ */ jsx("li", { children: "本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。" }),
					/* @__PURE__ */ jsx("li", { children: "当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。" }),
					/* @__PURE__ */ jsx("li", { children: "本規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。" })
				]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第2条（利用登録）"
			}),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [/* @__PURE__ */ jsx("li", { children: "本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこの承認を登録希望者に通知することによって、利用登録が完了するものとします。" }), /* @__PURE__ */ jsxs("li", { children: ["当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。", /* @__PURE__ */ jsxs("ol", {
					className: "list-decimal pl-8",
					children: [
						/* @__PURE__ */ jsx("li", { children: "利用登録の申請に際して虚偽の事項を届け出た場合" }),
						/* @__PURE__ */ jsx("li", { children: "本規約に違反したことがある者からの申請である場合" }),
						/* @__PURE__ */ jsx("li", { children: "その他、当社が利用登録を相当でないと判断した場合" })
					]
				})] })]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第3条（ユーザーIDおよびパスワードの管理）"
			}),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [
					/* @__PURE__ */ jsx("li", { children: "ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。" }),
					/* @__PURE__ */ jsx("li", { children: "ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してサインインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。" }),
					/* @__PURE__ */ jsx("li", { children: "ユーザーID及びパスワードが第三者によって使用されたことによって生じた損害は、当社に故意又は重大な過失がある場合を除き、当社は一切の責任を負わないものとします。" })
				]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第4条（利用料金および支払方法）"
			}),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [/* @__PURE__ */ jsx("li", { children: "ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、当社が指定する方法により支払うものとします。" }), /* @__PURE__ */ jsx("li", { children: "ユーザーが利用料金の支払を遅滞した場合には、ユーザーは年14．6％の割合による遅延損害金を支払うものとします。" })]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第5条（禁止事項）"
			}),
			/* @__PURE__ */ jsx("p", { children: "ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。" }),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [
					/* @__PURE__ */ jsx("li", { children: "法令または公序良俗に違反する行為" }),
					/* @__PURE__ */ jsx("li", { children: "犯罪行為に関連する行為" }),
					/* @__PURE__ */ jsx("li", { children: "当社、本サービスの他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為" }),
					/* @__PURE__ */ jsx("li", { children: "当社のサービスの運営を妨害するおそれのある行為" }),
					/* @__PURE__ */ jsx("li", { children: "他のユーザーに関する個人情報等を収集または蓄積する行為" }),
					/* @__PURE__ */ jsx("li", { children: "不正アクセスをし、またはこれを試みる行為" }),
					/* @__PURE__ */ jsx("li", { children: "他のユーザーに成りすます行為" }),
					/* @__PURE__ */ jsx("li", { children: "当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為" }),
					/* @__PURE__ */ jsx("li", { children: "当社、本サービスの他のユーザーまたは第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為" }),
					/* @__PURE__ */ jsxs("li", { children: ["以下の表現を含み、または含むと当社が判断する内容を本サービス上に投稿し、または送信する行為", /* @__PURE__ */ jsxs("ol", {
						className: "list-decimal pl-8",
						children: [
							/* @__PURE__ */ jsx("li", { children: "過度に暴力的な表現" }),
							/* @__PURE__ */ jsx("li", { children: "露骨な性的表現" }),
							/* @__PURE__ */ jsx("li", { children: "人種、国籍、信条、性別、社会的身分、門地等による差別につながる表現" }),
							/* @__PURE__ */ jsx("li", { children: "自殺、自傷行為、薬物乱用を誘引または助長する表現" }),
							/* @__PURE__ */ jsx("li", { children: "その他反社会的な内容を含み他人に不快感を与える表現" })
						]
					})] }),
					/* @__PURE__ */ jsxs("li", { children: ["以下を目的とし、または目的とすると当社が判断する行為", /* @__PURE__ */ jsxs("ol", {
						className: "list-decimal pl-8",
						children: [
							/* @__PURE__ */ jsx("li", { children: "営業、宣伝、広告、勧誘、その他営利を目的とする行為（当社の認めたものを除きます。）" }),
							/* @__PURE__ */ jsx("li", { children: "性行為やわいせつな行為を目的とする行為" }),
							/* @__PURE__ */ jsx("li", { children: "面識のない異性との出会いや交際を目的とする行為" }),
							/* @__PURE__ */ jsx("li", { children: "他のユーザーに対する嫌がらせや誹謗中傷を目的とする行為" }),
							/* @__PURE__ */ jsx("li", { children: "当社、本サービスの他のユーザー、または第三者に不利益、損害または不快感を与えることを目的とする行為" }),
							/* @__PURE__ */ jsx("li", { children: "その他本サービスが予定している利用目的と異なる目的で本サービスを利用する行為" })
						]
					})] }),
					/* @__PURE__ */ jsx("li", { children: "宗教活動または宗教団体への勧誘行為" }),
					/* @__PURE__ */ jsx("li", { children: "その他、当社が不適切と判断する行為" })
				]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第6条（本サービスの提供の停止等）"
			}),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [/* @__PURE__ */ jsxs("li", { children: ["当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。", /* @__PURE__ */ jsxs("ol", {
					className: "list-decimal pl-8",
					children: [
						/* @__PURE__ */ jsx("li", { children: "本サービスにかかるコンピュータシステムの保守点検または更新を行う場合" }),
						/* @__PURE__ */ jsx("li", { children: "地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合" }),
						/* @__PURE__ */ jsx("li", { children: "コンピュータまたは通信回線等が事故により停止した場合" }),
						/* @__PURE__ */ jsx("li", { children: "その他、当社が本サービスの提供が困難と判断した場合" })
					]
				})] }), /* @__PURE__ */ jsx("li", { children: "当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。" })]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第7条（著作権）"
			}),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [
					/* @__PURE__ */ jsx("li", { children: "ユーザーは、自ら著作権等の必要な知的財産権を有するか、または必要な権利者の許諾を得た文章、画像や映像等の情報に関してのみ、本サービスを利用し、投稿ないしアップロードすることができるものとします。" }),
					/* @__PURE__ */ jsx("li", { children: "ユーザーが本サービスを利用して投稿ないしアップロードした文章、画像、映像等の著作権については、当該ユーザーその他既存の権利者に留保されるものとします。ただし、当社は、本サービスを利用して投稿ないしアップロードされた文章、画像、映像等について、本サービスの改良、品質の向上、または不備の是正等ならびに本サービスの周知宣伝等に必要な範囲で利用できるものとし、ユーザーは、この利用に関して、著作者人格権を行使しないものとします。" }),
					/* @__PURE__ */ jsx("li", { children: "前項本文の定めるものを除き、本サービスおよび本サービスに関連する一切の情報についての著作権およびその他の知的財産権はすべて当社または当社にその利用を許諾した権利者に帰属し、ユーザーは無断で複製、譲渡、貸与、翻訳、改変、転載、公衆送信（送信可能化を含みます。）、伝送、配布、出版、営業使用等をしてはならないものとします。" })
				]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第8条（利用制限および登録抹消）"
			}),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [
					/* @__PURE__ */ jsxs("li", { children: ["当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、投稿データを削除し、ユーザーに対して本サービスの全部もしくは一部の利用を制限しまたはユーザーとしての登録を抹消することができるものとします。", /* @__PURE__ */ jsxs("ol", {
						className: "list-decimal pl-8",
						children: [
							/* @__PURE__ */ jsx("li", { children: "本規約のいずれかの条項に違反した場合" }),
							/* @__PURE__ */ jsx("li", { children: "登録事項に虚偽の事実があることが判明した場合" }),
							/* @__PURE__ */ jsx("li", { children: "決済手段として当該ユーザーが届け出たクレジットカードが利用停止となった場合" }),
							/* @__PURE__ */ jsx("li", { children: "料金等の支払債務の不履行があった場合" }),
							/* @__PURE__ */ jsx("li", { children: "当社からの連絡に対し、一定期間返答がない場合" }),
							/* @__PURE__ */ jsx("li", { children: "本サービスについて、最終の利用から一定期間利用がない場合" }),
							/* @__PURE__ */ jsx("li", { children: "その他、当社が本サービスの利用を適当でないと判断した場合" })
						]
					})] }),
					/* @__PURE__ */ jsx("li", { children: "前項各号のいずれかに該当した場合、ユーザーは、当然に当社に対する一切の債務について期限の利益を失い、その時点において負担する一切の債務を直ちに一括して弁済しなければなりません。" }),
					/* @__PURE__ */ jsx("li", { children: "当社は、本条に基づき当社が行った行為によりユーザーに生じた損害について、一切の責任を負いません。" })
				]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第9条（退会）"
			}),
			/* @__PURE__ */ jsx("p", { children: "ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。" }),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第10条（保証の否認および免責事項）"
			}),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [
					/* @__PURE__ */ jsx("li", { children: "当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。" }),
					/* @__PURE__ */ jsx("li", { children: "当社は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。" }),
					/* @__PURE__ */ jsx("li", { children: "前項ただし書に定める場合であっても、当社は、当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当社またはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。また、当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害の賠償は、ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。" }),
					/* @__PURE__ */ jsx("li", { children: "当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。" })
				]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第11条（サービス内容の変更等）"
			}),
			/* @__PURE__ */ jsx("p", { children: "当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。" }),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第12条（利用規約の変更）"
			}),
			/* @__PURE__ */ jsx("p", { children: "当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。" }),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第13条（個人情報の取扱い）"
			}),
			/* @__PURE__ */ jsx("p", { children: "当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。" }),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第14条（通知または連絡）"
			}),
			/* @__PURE__ */ jsx("p", { children: "ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。" }),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第15条（権利義務の譲渡の禁止）"
			}),
			/* @__PURE__ */ jsx("p", { children: "ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。" }),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 mb-2 font-[Rei_no_Are_Mincho] text-2xl leading-[normal] font-bold",
				children: "第16条（準拠法・裁判管轄）"
			}),
			/* @__PURE__ */ jsxs("ol", {
				className: "list-decimal pl-8",
				children: [/* @__PURE__ */ jsx("li", { children: "本規約の解釈にあたっては、日本法を準拠法とします。" }), /* @__PURE__ */ jsx("li", { children: "本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。" })]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-right",
				children: "以上"
			})
		]
	});
};
//#endregion
//#region src/containers/TermContainer.tsx
var TermContainer = () => {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("title", { children: "利用規約 - CaX" }), /* @__PURE__ */ jsx(TermPage, {})] });
};
//#endregion
//#region app/routes/terms.tsx
var terms_exports = /* @__PURE__ */ __exportAll({
	default: () => terms_default,
	meta: () => meta$2
});
function meta$2() {
	return [{ title: "利用規約 - CaX" }];
}
var terms_default = UNSAFE_withComponentProps(function TermsRoute() {
	return /* @__PURE__ */ jsx(TermContainer, {});
});
//#endregion
//#region src/components/crok/CrokGate.tsx
var CrokGate = ({ headline, description = "サインインするとCrok機能をご利用いただけます。", buttonLabel = "サインイン", authModalId }) => {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("title", { children: "Crok - CaX" }), /* @__PURE__ */ jsxs("section", {
		className: "space-y-4 px-6 py-12 text-center",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-lg font-bold",
				children: headline
			}),
			description !== "" ? /* @__PURE__ */ jsx("p", {
				className: "text-cax-text-muted text-sm",
				children: description
			}) : null,
			/* @__PURE__ */ jsx("button", {
				className: "bg-cax-brand text-cax-surface-raised hover:bg-cax-brand-strong inline-flex items-center justify-center rounded-full px-6 py-2 shadow",
				type: "button",
				command: "show-modal",
				commandfor: authModalId,
				children: buttonLabel
			})
		]
	})] });
};
//#endregion
//#region node_modules/.pnpm/bayesian-bm25@0.4.0/node_modules/bayesian-bm25/dist/bm25.js
var BM25 = class {
	k1;
	b;
	method;
	_numDocs = 0;
	_avgdl = 0;
	_docLengths = [];
	_invertedIndex = /* @__PURE__ */ new Map();
	_idf = /* @__PURE__ */ new Map();
	_indexed = false;
	constructor(options = {}) {
		this.k1 = options.k1 ?? 1.2;
		this.b = options.b ?? .75;
		this.method = options.method ?? "robertson";
	}
	get numDocs() {
		return this._numDocs;
	}
	index(corpusTokens) {
		this._numDocs = corpusTokens.length;
		this._docLengths = corpusTokens.map((doc) => doc.length);
		let totalLength = 0;
		for (const len of this._docLengths) totalLength += len;
		this._avgdl = this._numDocs > 0 ? totalLength / this._numDocs : 0;
		this._invertedIndex.clear();
		for (let docId = 0; docId < corpusTokens.length; docId++) {
			const tokens = corpusTokens[docId];
			const termFreqs = /* @__PURE__ */ new Map();
			for (const token of tokens) termFreqs.set(token, (termFreqs.get(token) ?? 0) + 1);
			for (const [term, tf] of termFreqs) {
				let postings = this._invertedIndex.get(term);
				if (!postings) {
					postings = [];
					this._invertedIndex.set(term, postings);
				}
				postings.push({
					docId,
					tf
				});
			}
		}
		this._idf.clear();
		for (const [term, postings] of this._invertedIndex) {
			const df = postings.length;
			this._idf.set(term, this._computeIDF(df));
		}
		this._indexed = true;
	}
	_computeIDF(df) {
		const n = this._numDocs;
		switch (this.method) {
			case "robertson": return Math.log((n - df + .5) / (df + .5) + 1);
			case "lucene": return Math.log(1 + (n - df + .5) / (df + .5));
			case "atire": return Math.log(n / df);
			default: return Math.log((n - df + .5) / (df + .5) + 1);
		}
	}
	getScores(queryTokens) {
		this._ensureIndexed();
		const scores = new Array(this._numDocs).fill(0);
		for (const token of queryTokens) {
			const idf = this._idf.get(token);
			if (idf === void 0) continue;
			const postings = this._invertedIndex.get(token);
			if (!postings) continue;
			for (const { docId, tf } of postings) {
				const dl = this._docLengths[docId];
				const tfNorm = tf * (this.k1 + 1) / (tf + this.k1 * (1 - this.b + this.b * (dl / this._avgdl)));
				scores[docId] += idf * tfNorm;
			}
		}
		return scores;
	}
	retrieve(queryTokensBatch, k) {
		this._ensureIndexed();
		const documents = [];
		const scores = [];
		for (const queryTokens of queryTokensBatch) {
			const indexed = this.getScores(queryTokens).map((score, idx) => ({
				idx,
				score
			}));
			indexed.sort((a, b) => b.score - a.score);
			const topK = indexed.slice(0, k);
			documents.push(topK.map((e) => e.idx));
			scores.push(topK.map((e) => e.score));
		}
		return {
			documents,
			scores
		};
	}
	_ensureIndexed() {
		if (!this._indexed) throw new Error("Call index() before querying.");
	}
};
//#endregion
//#region src/utils/bm25_search.ts
var STOP_POS = new Set([
	"助詞",
	"助動詞",
	"記号"
]);
/**
* 形態素解析で内容語トークン（名詞、動詞、形容詞など）を抽出
*/
function extractTokens(tokens) {
	return tokens.filter((t) => t.surface_form !== "" && t.pos !== "" && !STOP_POS.has(t.pos)).map((t) => t.surface_form.toLowerCase());
}
/**
* BM25で候補をスコアリングして、クエリと類似度の高い上位10件を返す
*/
function filterSuggestionsBM25(tokenizer, candidates, queryTokens) {
	if (queryTokens.length === 0) return [];
	const bm25 = new BM25({
		k1: 1.2,
		b: .75
	});
	const tokenizedCandidates = candidates.map((c) => extractTokens(tokenizer.tokenize(c)));
	bm25.index(tokenizedCandidates);
	const scores = bm25.getScores(queryTokens);
	return candidates.map((text, index) => ({
		text,
		score: scores[index] ?? 0
	})).filter((result) => result.score > 0).sort((left, right) => left.score - right.score).slice(-10).map((result) => result.text);
}
//#endregion
//#region src/utils/kuromoji_tokenizer.ts
var import_kuromoji = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(f) {
		if (typeof exports === "object" && typeof module !== "undefined") module.exports = f();
		else if (typeof define === "function" && define.amd) define([], f);
		else {
			var g;
			if (typeof window !== "undefined") g = window;
			else if (typeof global !== "undefined") g = global;
			else if (typeof self !== "undefined") g = self;
			else g = this;
			g.kuromoji = f();
		}
	})(function() {
		var define;
		return (function() {
			function e(t, n, r) {
				function s(o, u) {
					if (!n[o]) {
						if (!t[o]) {
							var a = typeof __require == "function" && __require;
							if (!u && a) return a(o, !0);
							if (i) return i(o, !0);
							var f = /* @__PURE__ */ new Error("Cannot find module '" + o + "'");
							throw f.code = "MODULE_NOT_FOUND", f;
						}
						var l = n[o] = { exports: {} };
						t[o][0].call(l.exports, function(e) {
							var n = t[o][1][e];
							return s(n ? n : e);
						}, l, l.exports, e, t, n, r);
					}
					return n[o].exports;
				}
				var i = typeof __require == "function" && __require;
				for (var o = 0; o < r.length; o++) s(r[o]);
				return s;
			}
			return e;
		})()({
			1: [function(require, module$1, exports$1) {
				(function(process, global) {
					(function(global, factory) {
						typeof exports$1 === "object" && typeof module$1 !== "undefined" ? factory(exports$1) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.async = global.async || {});
					})(this, (function(exports$2) {
						"use strict";
						function slice(arrayLike, start) {
							start = start | 0;
							var newLen = Math.max(arrayLike.length - start, 0);
							var newArr = Array(newLen);
							for (var idx = 0; idx < newLen; idx++) newArr[idx] = arrayLike[start + idx];
							return newArr;
						}
						/**
						* Creates a continuation function with some arguments already applied.
						*
						* Useful as a shorthand when combined with other control flow functions. Any
						* arguments passed to the returned function are added to the arguments
						* originally passed to apply.
						*
						* @name apply
						* @static
						* @memberOf module:Utils
						* @method
						* @category Util
						* @param {Function} fn - The function you want to eventually apply all
						* arguments to. Invokes with (arguments...).
						* @param {...*} arguments... - Any number of arguments to automatically apply
						* when the continuation is called.
						* @returns {Function} the partially-applied function
						* @example
						*
						* // using apply
						* async.parallel([
						*     async.apply(fs.writeFile, 'testfile1', 'test1'),
						*     async.apply(fs.writeFile, 'testfile2', 'test2')
						* ]);
						*
						*
						* // the same process without using apply
						* async.parallel([
						*     function(callback) {
						*         fs.writeFile('testfile1', 'test1', callback);
						*     },
						*     function(callback) {
						*         fs.writeFile('testfile2', 'test2', callback);
						*     }
						* ]);
						*
						* // It's possible to pass any number of additional arguments when calling the
						* // continuation:
						*
						* node> var fn = async.apply(sys.puts, 'one');
						* node> fn('two', 'three');
						* one
						* two
						* three
						*/
						var apply = function(fn) {
							var args = slice(arguments, 1);
							return function() {
								var callArgs = slice(arguments);
								return fn.apply(null, args.concat(callArgs));
							};
						};
						var initialParams = function(fn) {
							return function() {
								var args = slice(arguments);
								var callback = args.pop();
								fn.call(this, args, callback);
							};
						};
						/**
						* Checks if `value` is the
						* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
						* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
						*
						* @static
						* @memberOf _
						* @since 0.1.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is an object, else `false`.
						* @example
						*
						* _.isObject({});
						* // => true
						*
						* _.isObject([1, 2, 3]);
						* // => true
						*
						* _.isObject(_.noop);
						* // => true
						*
						* _.isObject(null);
						* // => false
						*/
						function isObject(value) {
							var type = typeof value;
							return value != null && (type == "object" || type == "function");
						}
						var hasSetImmediate = typeof setImmediate === "function" && setImmediate;
						var hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
						function fallback(fn) {
							setTimeout(fn, 0);
						}
						function wrap(defer) {
							return function(fn) {
								var args = slice(arguments, 1);
								defer(function() {
									fn.apply(null, args);
								});
							};
						}
						var _defer;
						if (hasSetImmediate) _defer = setImmediate;
						else if (hasNextTick) _defer = process.nextTick;
						else _defer = fallback;
						var setImmediate$1 = wrap(_defer);
						/**
						* Take a sync function and make it async, passing its return value to a
						* callback. This is useful for plugging sync functions into a waterfall,
						* series, or other async functions. Any arguments passed to the generated
						* function will be passed to the wrapped function (except for the final
						* callback argument). Errors thrown will be passed to the callback.
						*
						* If the function passed to `asyncify` returns a Promise, that promises's
						* resolved/rejected state will be used to call the callback, rather than simply
						* the synchronous return value.
						*
						* This also means you can asyncify ES2017 `async` functions.
						*
						* @name asyncify
						* @static
						* @memberOf module:Utils
						* @method
						* @alias wrapSync
						* @category Util
						* @param {Function} func - The synchronous function, or Promise-returning
						* function to convert to an {@link AsyncFunction}.
						* @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
						* invoked with `(args..., callback)`.
						* @example
						*
						* // passing a regular synchronous function
						* async.waterfall([
						*     async.apply(fs.readFile, filename, "utf8"),
						*     async.asyncify(JSON.parse),
						*     function (data, next) {
						*         // data is the result of parsing the text.
						*         // If there was a parsing error, it would have been caught.
						*     }
						* ], callback);
						*
						* // passing a function returning a promise
						* async.waterfall([
						*     async.apply(fs.readFile, filename, "utf8"),
						*     async.asyncify(function (contents) {
						*         return db.model.create(contents);
						*     }),
						*     function (model, next) {
						*         // `model` is the instantiated model object.
						*         // If there was an error, this function would be skipped.
						*     }
						* ], callback);
						*
						* // es2017 example, though `asyncify` is not needed if your JS environment
						* // supports async functions out of the box
						* var q = async.queue(async.asyncify(async function(file) {
						*     var intermediateStep = await processFile(file);
						*     return await somePromise(intermediateStep)
						* }));
						*
						* q.push(files);
						*/
						function asyncify(func) {
							return initialParams(function(args, callback) {
								var result;
								try {
									result = func.apply(this, args);
								} catch (e) {
									return callback(e);
								}
								if (isObject(result) && typeof result.then === "function") result.then(function(value) {
									invokeCallback(callback, null, value);
								}, function(err) {
									invokeCallback(callback, err.message ? err : new Error(err));
								});
								else callback(null, result);
							});
						}
						function invokeCallback(callback, error, value) {
							try {
								callback(error, value);
							} catch (e) {
								setImmediate$1(rethrow, e);
							}
						}
						function rethrow(error) {
							throw error;
						}
						var supportsSymbol = typeof Symbol === "function";
						function isAsync(fn) {
							return supportsSymbol && fn[Symbol.toStringTag] === "AsyncFunction";
						}
						function wrapAsync(asyncFn) {
							return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
						}
						function applyEach$1(eachfn) {
							return function(fns) {
								var args = slice(arguments, 1);
								var go = initialParams(function(args, callback) {
									var that = this;
									return eachfn(fns, function(fn, cb) {
										wrapAsync(fn).apply(that, args.concat(cb));
									}, callback);
								});
								if (args.length) return go.apply(this, args);
								else return go;
							};
						}
						/** Detect free variable `global` from Node.js. */
						var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
						/** Detect free variable `self`. */
						var freeSelf = typeof self == "object" && self && self.Object === Object && self;
						/** Used as a reference to the global object. */
						var root = freeGlobal || freeSelf || Function("return this")();
						/** Built-in value references. */
						var Symbol$1 = root.Symbol;
						/** Used for built-in method references. */
						var objectProto = Object.prototype;
						/** Used to check objects for own properties. */
						var hasOwnProperty = objectProto.hasOwnProperty;
						/**
						* Used to resolve the
						* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
						* of values.
						*/
						var nativeObjectToString = objectProto.toString;
						/** Built-in value references. */
						var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
						/**
						* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
						*
						* @private
						* @param {*} value The value to query.
						* @returns {string} Returns the raw `toStringTag`.
						*/
						function getRawTag(value) {
							var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
							try {
								value[symToStringTag$1] = void 0;
								var unmasked = true;
							} catch (e) {}
							var result = nativeObjectToString.call(value);
							if (unmasked) if (isOwn) value[symToStringTag$1] = tag;
							else delete value[symToStringTag$1];
							return result;
						}
						/**
						* Used to resolve the
						* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
						* of values.
						*/
						var nativeObjectToString$1 = Object.prototype.toString;
						/**
						* Converts `value` to a string using `Object.prototype.toString`.
						*
						* @private
						* @param {*} value The value to convert.
						* @returns {string} Returns the converted string.
						*/
						function objectToString(value) {
							return nativeObjectToString$1.call(value);
						}
						/** `Object#toString` result references. */
						var nullTag = "[object Null]";
						var undefinedTag = "[object Undefined]";
						/** Built-in value references. */
						var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
						/**
						* The base implementation of `getTag` without fallbacks for buggy environments.
						*
						* @private
						* @param {*} value The value to query.
						* @returns {string} Returns the `toStringTag`.
						*/
						function baseGetTag(value) {
							if (value == null) return value === void 0 ? undefinedTag : nullTag;
							return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
						}
						/** `Object#toString` result references. */
						var asyncTag = "[object AsyncFunction]";
						var funcTag = "[object Function]";
						var genTag = "[object GeneratorFunction]";
						var proxyTag = "[object Proxy]";
						/**
						* Checks if `value` is classified as a `Function` object.
						*
						* @static
						* @memberOf _
						* @since 0.1.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is a function, else `false`.
						* @example
						*
						* _.isFunction(_);
						* // => true
						*
						* _.isFunction(/abc/);
						* // => false
						*/
						function isFunction(value) {
							if (!isObject(value)) return false;
							var tag = baseGetTag(value);
							return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
						}
						/** Used as references for various `Number` constants. */
						var MAX_SAFE_INTEGER = 9007199254740991;
						/**
						* Checks if `value` is a valid array-like length.
						*
						* **Note:** This method is loosely based on
						* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
						*
						* @static
						* @memberOf _
						* @since 4.0.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
						* @example
						*
						* _.isLength(3);
						* // => true
						*
						* _.isLength(Number.MIN_VALUE);
						* // => false
						*
						* _.isLength(Infinity);
						* // => false
						*
						* _.isLength('3');
						* // => false
						*/
						function isLength(value) {
							return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
						}
						/**
						* Checks if `value` is array-like. A value is considered array-like if it's
						* not a function and has a `value.length` that's an integer greater than or
						* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
						*
						* @static
						* @memberOf _
						* @since 4.0.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
						* @example
						*
						* _.isArrayLike([1, 2, 3]);
						* // => true
						*
						* _.isArrayLike(document.body.children);
						* // => true
						*
						* _.isArrayLike('abc');
						* // => true
						*
						* _.isArrayLike(_.noop);
						* // => false
						*/
						function isArrayLike(value) {
							return value != null && isLength(value.length) && !isFunction(value);
						}
						var breakLoop = {};
						/**
						* This method returns `undefined`.
						*
						* @static
						* @memberOf _
						* @since 2.3.0
						* @category Util
						* @example
						*
						* _.times(2, _.noop);
						* // => [undefined, undefined]
						*/
						function noop() {}
						function once(fn) {
							return function() {
								if (fn === null) return;
								var callFn = fn;
								fn = null;
								callFn.apply(this, arguments);
							};
						}
						var iteratorSymbol = typeof Symbol === "function" && Symbol.iterator;
						var getIterator = function(coll) {
							return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
						};
						/**
						* The base implementation of `_.times` without support for iteratee shorthands
						* or max array length checks.
						*
						* @private
						* @param {number} n The number of times to invoke `iteratee`.
						* @param {Function} iteratee The function invoked per iteration.
						* @returns {Array} Returns the array of results.
						*/
						function baseTimes(n, iteratee) {
							var index = -1, result = Array(n);
							while (++index < n) result[index] = iteratee(index);
							return result;
						}
						/**
						* Checks if `value` is object-like. A value is object-like if it's not `null`
						* and has a `typeof` result of "object".
						*
						* @static
						* @memberOf _
						* @since 4.0.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
						* @example
						*
						* _.isObjectLike({});
						* // => true
						*
						* _.isObjectLike([1, 2, 3]);
						* // => true
						*
						* _.isObjectLike(_.noop);
						* // => false
						*
						* _.isObjectLike(null);
						* // => false
						*/
						function isObjectLike(value) {
							return value != null && typeof value == "object";
						}
						/** `Object#toString` result references. */
						var argsTag = "[object Arguments]";
						/**
						* The base implementation of `_.isArguments`.
						*
						* @private
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is an `arguments` object,
						*/
						function baseIsArguments(value) {
							return isObjectLike(value) && baseGetTag(value) == argsTag;
						}
						/** Used for built-in method references. */
						var objectProto$3 = Object.prototype;
						/** Used to check objects for own properties. */
						var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
						/** Built-in value references. */
						var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
						/**
						* Checks if `value` is likely an `arguments` object.
						*
						* @static
						* @memberOf _
						* @since 0.1.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is an `arguments` object,
						*  else `false`.
						* @example
						*
						* _.isArguments(function() { return arguments; }());
						* // => true
						*
						* _.isArguments([1, 2, 3]);
						* // => false
						*/
						var isArguments = baseIsArguments(function() {
							return arguments;
						}()) ? baseIsArguments : function(value) {
							return isObjectLike(value) && hasOwnProperty$2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
						};
						/**
						* Checks if `value` is classified as an `Array` object.
						*
						* @static
						* @memberOf _
						* @since 0.1.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is an array, else `false`.
						* @example
						*
						* _.isArray([1, 2, 3]);
						* // => true
						*
						* _.isArray(document.body.children);
						* // => false
						*
						* _.isArray('abc');
						* // => false
						*
						* _.isArray(_.noop);
						* // => false
						*/
						var isArray = Array.isArray;
						/**
						* This method returns `false`.
						*
						* @static
						* @memberOf _
						* @since 4.13.0
						* @category Util
						* @returns {boolean} Returns `false`.
						* @example
						*
						* _.times(2, _.stubFalse);
						* // => [false, false]
						*/
						function stubFalse() {
							return false;
						}
						/** Detect free variable `exports`. */
						var freeExports = typeof exports$2 == "object" && exports$2 && !exports$2.nodeType && exports$2;
						/** Detect free variable `module`. */
						var freeModule = freeExports && typeof module$1 == "object" && module$1 && !module$1.nodeType && module$1;
						/** Built-in value references. */
						var Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0;
						/**
						* Checks if `value` is a buffer.
						*
						* @static
						* @memberOf _
						* @since 4.3.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
						* @example
						*
						* _.isBuffer(new Buffer(2));
						* // => true
						*
						* _.isBuffer(new Uint8Array(2));
						* // => false
						*/
						var isBuffer = (Buffer ? Buffer.isBuffer : void 0) || stubFalse;
						/** Used as references for various `Number` constants. */
						var MAX_SAFE_INTEGER$1 = 9007199254740991;
						/** Used to detect unsigned integer values. */
						var reIsUint = /^(?:0|[1-9]\d*)$/;
						/**
						* Checks if `value` is a valid array-like index.
						*
						* @private
						* @param {*} value The value to check.
						* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
						* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
						*/
						function isIndex(value, length) {
							length = length == null ? MAX_SAFE_INTEGER$1 : length;
							return !!length && (typeof value == "number" || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
						}
						/** `Object#toString` result references. */
						var argsTag$1 = "[object Arguments]";
						var arrayTag = "[object Array]";
						var boolTag = "[object Boolean]";
						var dateTag = "[object Date]";
						var errorTag = "[object Error]";
						var funcTag$1 = "[object Function]";
						var mapTag = "[object Map]";
						var numberTag = "[object Number]";
						var objectTag = "[object Object]";
						var regexpTag = "[object RegExp]";
						var setTag = "[object Set]";
						var stringTag = "[object String]";
						var weakMapTag = "[object WeakMap]";
						var arrayBufferTag = "[object ArrayBuffer]";
						var dataViewTag = "[object DataView]";
						var float32Tag = "[object Float32Array]";
						var float64Tag = "[object Float64Array]";
						var int8Tag = "[object Int8Array]";
						var int16Tag = "[object Int16Array]";
						var int32Tag = "[object Int32Array]";
						var uint8Tag = "[object Uint8Array]";
						var uint8ClampedTag = "[object Uint8ClampedArray]";
						var uint16Tag = "[object Uint16Array]";
						var uint32Tag = "[object Uint32Array]";
						/** Used to identify `toStringTag` values of typed arrays. */
						var typedArrayTags = {};
						typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
						typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
						/**
						* The base implementation of `_.isTypedArray` without Node.js optimizations.
						*
						* @private
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
						*/
						function baseIsTypedArray(value) {
							return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
						}
						/**
						* The base implementation of `_.unary` without support for storing metadata.
						*
						* @private
						* @param {Function} func The function to cap arguments for.
						* @returns {Function} Returns the new capped function.
						*/
						function baseUnary(func) {
							return function(value) {
								return func(value);
							};
						}
						/** Detect free variable `exports`. */
						var freeExports$1 = typeof exports$2 == "object" && exports$2 && !exports$2.nodeType && exports$2;
						/** Detect free variable `module`. */
						var freeModule$1 = freeExports$1 && typeof module$1 == "object" && module$1 && !module$1.nodeType && module$1;
						/** Detect free variable `process` from Node.js. */
						var freeProcess = freeModule$1 && freeModule$1.exports === freeExports$1 && freeGlobal.process;
						/** Used to access faster Node.js helpers. */
						var nodeUtil = function() {
							try {
								return freeProcess && freeProcess.binding && freeProcess.binding("util");
							} catch (e) {}
						}();
						var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
						/**
						* Checks if `value` is classified as a typed array.
						*
						* @static
						* @memberOf _
						* @since 3.0.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
						* @example
						*
						* _.isTypedArray(new Uint8Array);
						* // => true
						*
						* _.isTypedArray([]);
						* // => false
						*/
						var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
						/** Used to check objects for own properties. */
						var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
						/**
						* Creates an array of the enumerable property names of the array-like `value`.
						*
						* @private
						* @param {*} value The value to query.
						* @param {boolean} inherited Specify returning inherited property names.
						* @returns {Array} Returns the array of property names.
						*/
						function arrayLikeKeys(value, inherited) {
							var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
							for (var key in value) if ((inherited || hasOwnProperty$1.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
							return result;
						}
						/** Used for built-in method references. */
						var objectProto$5 = Object.prototype;
						/**
						* Checks if `value` is likely a prototype object.
						*
						* @private
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
						*/
						function isPrototype(value) {
							var Ctor = value && value.constructor;
							return value === (typeof Ctor == "function" && Ctor.prototype || objectProto$5);
						}
						/**
						* Creates a unary function that invokes `func` with its argument transformed.
						*
						* @private
						* @param {Function} func The function to wrap.
						* @param {Function} transform The argument transform.
						* @returns {Function} Returns the new function.
						*/
						function overArg(func, transform) {
							return function(arg) {
								return func(transform(arg));
							};
						}
						var nativeKeys = overArg(Object.keys, Object);
						/** Used to check objects for own properties. */
						var hasOwnProperty$3 = Object.prototype.hasOwnProperty;
						/**
						* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
						*
						* @private
						* @param {Object} object The object to query.
						* @returns {Array} Returns the array of property names.
						*/
						function baseKeys(object) {
							if (!isPrototype(object)) return nativeKeys(object);
							var result = [];
							for (var key in Object(object)) if (hasOwnProperty$3.call(object, key) && key != "constructor") result.push(key);
							return result;
						}
						/**
						* Creates an array of the own enumerable property names of `object`.
						*
						* **Note:** Non-object values are coerced to objects. See the
						* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
						* for more details.
						*
						* @static
						* @since 0.1.0
						* @memberOf _
						* @category Object
						* @param {Object} object The object to query.
						* @returns {Array} Returns the array of property names.
						* @example
						*
						* function Foo() {
						*   this.a = 1;
						*   this.b = 2;
						* }
						*
						* Foo.prototype.c = 3;
						*
						* _.keys(new Foo);
						* // => ['a', 'b'] (iteration order is not guaranteed)
						*
						* _.keys('hi');
						* // => ['0', '1']
						*/
						function keys(object) {
							return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
						}
						function createArrayIterator(coll) {
							var i = -1;
							var len = coll.length;
							return function next() {
								return ++i < len ? {
									value: coll[i],
									key: i
								} : null;
							};
						}
						function createES2015Iterator(iterator) {
							var i = -1;
							return function next() {
								var item = iterator.next();
								if (item.done) return null;
								i++;
								return {
									value: item.value,
									key: i
								};
							};
						}
						function createObjectIterator(obj) {
							var okeys = keys(obj);
							var i = -1;
							var len = okeys.length;
							return function next() {
								var key = okeys[++i];
								return i < len ? {
									value: obj[key],
									key
								} : null;
							};
						}
						function iterator(coll) {
							if (isArrayLike(coll)) return createArrayIterator(coll);
							var iterator = getIterator(coll);
							return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
						}
						function onlyOnce(fn) {
							return function() {
								if (fn === null) throw new Error("Callback was already called.");
								var callFn = fn;
								fn = null;
								callFn.apply(this, arguments);
							};
						}
						function _eachOfLimit(limit) {
							return function(obj, iteratee, callback) {
								callback = once(callback || noop);
								if (limit <= 0 || !obj) return callback(null);
								var nextElem = iterator(obj);
								var done = false;
								var running = 0;
								function iterateeCallback(err, value) {
									running -= 1;
									if (err) {
										done = true;
										callback(err);
									} else if (value === breakLoop || done && running <= 0) {
										done = true;
										return callback(null);
									} else replenish();
								}
								function replenish() {
									while (running < limit && !done) {
										var elem = nextElem();
										if (elem === null) {
											done = true;
											if (running <= 0) callback(null);
											return;
										}
										running += 1;
										iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
									}
								}
								replenish();
							};
						}
						/**
						* The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
						* time.
						*
						* @name eachOfLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.eachOf]{@link module:Collections.eachOf}
						* @alias forEachOfLimit
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - An async function to apply to each
						* item in `coll`. The `key` is the item's key, or index in the case of an
						* array.
						* Invoked with (item, key, callback).
						* @param {Function} [callback] - A callback which is called when all
						* `iteratee` functions have finished, or an error occurs. Invoked with (err).
						*/
						function eachOfLimit(coll, limit, iteratee, callback) {
							_eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
						}
						function doLimit(fn, limit) {
							return function(iterable, iteratee, callback) {
								return fn(iterable, limit, iteratee, callback);
							};
						}
						function eachOfArrayLike(coll, iteratee, callback) {
							callback = once(callback || noop);
							var index = 0, completed = 0, length = coll.length;
							if (length === 0) callback(null);
							function iteratorCallback(err, value) {
								if (err) callback(err);
								else if (++completed === length || value === breakLoop) callback(null);
							}
							for (; index < length; index++) iteratee(coll[index], index, onlyOnce(iteratorCallback));
						}
						var eachOfGeneric = doLimit(eachOfLimit, Infinity);
						/**
						* Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
						* to the iteratee.
						*
						* @name eachOf
						* @static
						* @memberOf module:Collections
						* @method
						* @alias forEachOf
						* @category Collection
						* @see [async.each]{@link module:Collections.each}
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - A function to apply to each
						* item in `coll`.
						* The `key` is the item's key, or index in the case of an array.
						* Invoked with (item, key, callback).
						* @param {Function} [callback] - A callback which is called when all
						* `iteratee` functions have finished, or an error occurs. Invoked with (err).
						* @example
						*
						* var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
						* var configs = {};
						*
						* async.forEachOf(obj, function (value, key, callback) {
						*     fs.readFile(__dirname + value, "utf8", function (err, data) {
						*         if (err) return callback(err);
						*         try {
						*             configs[key] = JSON.parse(data);
						*         } catch (e) {
						*             return callback(e);
						*         }
						*         callback();
						*     });
						* }, function (err) {
						*     if (err) console.error(err.message);
						*     // configs is now a map of JSON data
						*     doSomethingWith(configs);
						* });
						*/
						var eachOf = function(coll, iteratee, callback) {
							(isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric)(coll, wrapAsync(iteratee), callback);
						};
						function doParallel(fn) {
							return function(obj, iteratee, callback) {
								return fn(eachOf, obj, wrapAsync(iteratee), callback);
							};
						}
						function _asyncMap(eachfn, arr, iteratee, callback) {
							callback = callback || noop;
							arr = arr || [];
							var results = [];
							var counter = 0;
							var _iteratee = wrapAsync(iteratee);
							eachfn(arr, function(value, _, callback) {
								var index = counter++;
								_iteratee(value, function(err, v) {
									results[index] = v;
									callback(err);
								});
							}, function(err) {
								callback(err, results);
							});
						}
						/**
						* Produces a new collection of values by mapping each value in `coll` through
						* the `iteratee` function. The `iteratee` is called with an item from `coll`
						* and a callback for when it has finished processing. Each of these callback
						* takes 2 arguments: an `error`, and the transformed item from `coll`. If
						* `iteratee` passes an error to its callback, the main `callback` (for the
						* `map` function) is immediately called with the error.
						*
						* Note, that since this function applies the `iteratee` to each item in
						* parallel, there is no guarantee that the `iteratee` functions will complete
						* in order. However, the results array will be in the same order as the
						* original `coll`.
						*
						* If `map` is passed an Object, the results will be an Array.  The results
						* will roughly be in the order of the original Objects' keys (but this can
						* vary across JavaScript engines).
						*
						* @name map
						* @static
						* @memberOf module:Collections
						* @method
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async function to apply to each item in
						* `coll`.
						* The iteratee should complete with the transformed item.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. Results is an Array of the
						* transformed items from the `coll`. Invoked with (err, results).
						* @example
						*
						* async.map(['file1','file2','file3'], fs.stat, function(err, results) {
						*     // results is now an array of stats for each file
						* });
						*/
						var map = doParallel(_asyncMap);
						/**
						* Applies the provided arguments to each function in the array, calling
						* `callback` after all functions have completed. If you only provide the first
						* argument, `fns`, then it will return a function which lets you pass in the
						* arguments as if it were a single function call. If more arguments are
						* provided, `callback` is required while `args` is still optional.
						*
						* @name applyEach
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {Array|Iterable|Object} fns - A collection of {@link AsyncFunction}s
						* to all call with the same arguments
						* @param {...*} [args] - any number of separate arguments to pass to the
						* function.
						* @param {Function} [callback] - the final argument should be the callback,
						* called when all functions have completed processing.
						* @returns {Function} - If only the first argument, `fns`, is provided, it will
						* return a function which lets you pass in the arguments as if it were a single
						* function call. The signature is `(..args, callback)`. If invoked with any
						* arguments, `callback` is required.
						* @example
						*
						* async.applyEach([enableSearch, updateSchema], 'bucket', callback);
						*
						* // partial application example:
						* async.each(
						*     buckets,
						*     async.applyEach([enableSearch, updateSchema]),
						*     callback
						* );
						*/
						var applyEach = applyEach$1(map);
						function doParallelLimit(fn) {
							return function(obj, limit, iteratee, callback) {
								return fn(_eachOfLimit(limit), obj, wrapAsync(iteratee), callback);
							};
						}
						/**
						* The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
						*
						* @name mapLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.map]{@link module:Collections.map}
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - An async function to apply to each item in
						* `coll`.
						* The iteratee should complete with the transformed item.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. Results is an array of the
						* transformed items from the `coll`. Invoked with (err, results).
						*/
						var mapLimit = doParallelLimit(_asyncMap);
						/**
						* The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
						*
						* @name mapSeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.map]{@link module:Collections.map}
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async function to apply to each item in
						* `coll`.
						* The iteratee should complete with the transformed item.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. Results is an array of the
						* transformed items from the `coll`. Invoked with (err, results).
						*/
						var mapSeries = doLimit(mapLimit, 1);
						/**
						* The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
						*
						* @name applyEachSeries
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.applyEach]{@link module:ControlFlow.applyEach}
						* @category Control Flow
						* @param {Array|Iterable|Object} fns - A collection of {@link AsyncFunction}s to all
						* call with the same arguments
						* @param {...*} [args] - any number of separate arguments to pass to the
						* function.
						* @param {Function} [callback] - the final argument should be the callback,
						* called when all functions have completed processing.
						* @returns {Function} - If only the first argument is provided, it will return
						* a function which lets you pass in the arguments as if it were a single
						* function call.
						*/
						var applyEachSeries = applyEach$1(mapSeries);
						/**
						* A specialized version of `_.forEach` for arrays without support for
						* iteratee shorthands.
						*
						* @private
						* @param {Array} [array] The array to iterate over.
						* @param {Function} iteratee The function invoked per iteration.
						* @returns {Array} Returns `array`.
						*/
						function arrayEach(array, iteratee) {
							var index = -1, length = array == null ? 0 : array.length;
							while (++index < length) if (iteratee(array[index], index, array) === false) break;
							return array;
						}
						/**
						* Creates a base function for methods like `_.forIn` and `_.forOwn`.
						*
						* @private
						* @param {boolean} [fromRight] Specify iterating from right to left.
						* @returns {Function} Returns the new base function.
						*/
						function createBaseFor(fromRight) {
							return function(object, iteratee, keysFunc) {
								var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
								while (length--) {
									var key = props[fromRight ? length : ++index];
									if (iteratee(iterable[key], key, iterable) === false) break;
								}
								return object;
							};
						}
						/**
						* The base implementation of `baseForOwn` which iterates over `object`
						* properties returned by `keysFunc` and invokes `iteratee` for each property.
						* Iteratee functions may exit iteration early by explicitly returning `false`.
						*
						* @private
						* @param {Object} object The object to iterate over.
						* @param {Function} iteratee The function invoked per iteration.
						* @param {Function} keysFunc The function to get the keys of `object`.
						* @returns {Object} Returns `object`.
						*/
						var baseFor = createBaseFor();
						/**
						* The base implementation of `_.forOwn` without support for iteratee shorthands.
						*
						* @private
						* @param {Object} object The object to iterate over.
						* @param {Function} iteratee The function invoked per iteration.
						* @returns {Object} Returns `object`.
						*/
						function baseForOwn(object, iteratee) {
							return object && baseFor(object, iteratee, keys);
						}
						/**
						* The base implementation of `_.findIndex` and `_.findLastIndex` without
						* support for iteratee shorthands.
						*
						* @private
						* @param {Array} array The array to inspect.
						* @param {Function} predicate The function invoked per iteration.
						* @param {number} fromIndex The index to search from.
						* @param {boolean} [fromRight] Specify iterating from right to left.
						* @returns {number} Returns the index of the matched value, else `-1`.
						*/
						function baseFindIndex(array, predicate, fromIndex, fromRight) {
							var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
							while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
							return -1;
						}
						/**
						* The base implementation of `_.isNaN` without support for number objects.
						*
						* @private
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
						*/
						function baseIsNaN(value) {
							return value !== value;
						}
						/**
						* A specialized version of `_.indexOf` which performs strict equality
						* comparisons of values, i.e. `===`.
						*
						* @private
						* @param {Array} array The array to inspect.
						* @param {*} value The value to search for.
						* @param {number} fromIndex The index to search from.
						* @returns {number} Returns the index of the matched value, else `-1`.
						*/
						function strictIndexOf(array, value, fromIndex) {
							var index = fromIndex - 1, length = array.length;
							while (++index < length) if (array[index] === value) return index;
							return -1;
						}
						/**
						* The base implementation of `_.indexOf` without `fromIndex` bounds checks.
						*
						* @private
						* @param {Array} array The array to inspect.
						* @param {*} value The value to search for.
						* @param {number} fromIndex The index to search from.
						* @returns {number} Returns the index of the matched value, else `-1`.
						*/
						function baseIndexOf(array, value, fromIndex) {
							return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
						}
						/**
						* Determines the best order for running the {@link AsyncFunction}s in `tasks`, based on
						* their requirements. Each function can optionally depend on other functions
						* being completed first, and each function is run as soon as its requirements
						* are satisfied.
						*
						* If any of the {@link AsyncFunction}s pass an error to their callback, the `auto` sequence
						* will stop. Further tasks will not execute (so any other functions depending
						* on it will not run), and the main `callback` is immediately called with the
						* error.
						*
						* {@link AsyncFunction}s also receive an object containing the results of functions which
						* have completed so far as the first argument, if they have dependencies. If a
						* task function has no dependencies, it will only be passed a callback.
						*
						* @name auto
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {Object} tasks - An object. Each of its properties is either a
						* function or an array of requirements, with the {@link AsyncFunction} itself the last item
						* in the array. The object's key of a property serves as the name of the task
						* defined by that property, i.e. can be used when specifying requirements for
						* other tasks. The function receives one or two arguments:
						* * a `results` object, containing the results of the previously executed
						*   functions, only passed if the task has any dependencies,
						* * a `callback(err, result)` function, which must be called when finished,
						*   passing an `error` (which can be `null`) and the result of the function's
						*   execution.
						* @param {number} [concurrency=Infinity] - An optional `integer` for
						* determining the maximum number of tasks that can be run in parallel. By
						* default, as many as possible.
						* @param {Function} [callback] - An optional callback which is called when all
						* the tasks have been completed. It receives the `err` argument if any `tasks`
						* pass an error to their callback. Results are always returned; however, if an
						* error occurs, no further `tasks` will be performed, and the results object
						* will only contain partial results. Invoked with (err, results).
						* @returns undefined
						* @example
						*
						* async.auto({
						*     // this function will just be passed a callback
						*     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
						*     showData: ['readData', function(results, cb) {
						*         // results.readData is the file's contents
						*         // ...
						*     }]
						* }, callback);
						*
						* async.auto({
						*     get_data: function(callback) {
						*         console.log('in get_data');
						*         // async code to get some data
						*         callback(null, 'data', 'converted to array');
						*     },
						*     make_folder: function(callback) {
						*         console.log('in make_folder');
						*         // async code to create a directory to store a file in
						*         // this is run at the same time as getting the data
						*         callback(null, 'folder');
						*     },
						*     write_file: ['get_data', 'make_folder', function(results, callback) {
						*         console.log('in write_file', JSON.stringify(results));
						*         // once there is some data and the directory exists,
						*         // write the data to a file in the directory
						*         callback(null, 'filename');
						*     }],
						*     email_link: ['write_file', function(results, callback) {
						*         console.log('in email_link', JSON.stringify(results));
						*         // once the file is written let's email a link to it...
						*         // results.write_file contains the filename returned by write_file.
						*         callback(null, {'file':results.write_file, 'email':'user@example.com'});
						*     }]
						* }, function(err, results) {
						*     console.log('err = ', err);
						*     console.log('results = ', results);
						* });
						*/
						var auto = function(tasks, concurrency, callback) {
							if (typeof concurrency === "function") {
								callback = concurrency;
								concurrency = null;
							}
							callback = once(callback || noop);
							var numTasks = keys(tasks).length;
							if (!numTasks) return callback(null);
							if (!concurrency) concurrency = numTasks;
							var results = {};
							var runningTasks = 0;
							var hasError = false;
							var listeners = Object.create(null);
							var readyTasks = [];
							var readyToCheck = [];
							var uncheckedDependencies = {};
							baseForOwn(tasks, function(task, key) {
								if (!isArray(task)) {
									enqueueTask(key, [task]);
									readyToCheck.push(key);
									return;
								}
								var dependencies = task.slice(0, task.length - 1);
								var remainingDependencies = dependencies.length;
								if (remainingDependencies === 0) {
									enqueueTask(key, task);
									readyToCheck.push(key);
									return;
								}
								uncheckedDependencies[key] = remainingDependencies;
								arrayEach(dependencies, function(dependencyName) {
									if (!tasks[dependencyName]) throw new Error("async.auto task `" + key + "` has a non-existent dependency `" + dependencyName + "` in " + dependencies.join(", "));
									addListener(dependencyName, function() {
										remainingDependencies--;
										if (remainingDependencies === 0) enqueueTask(key, task);
									});
								});
							});
							checkForDeadlocks();
							processQueue();
							function enqueueTask(key, task) {
								readyTasks.push(function() {
									runTask(key, task);
								});
							}
							function processQueue() {
								if (readyTasks.length === 0 && runningTasks === 0) return callback(null, results);
								while (readyTasks.length && runningTasks < concurrency) readyTasks.shift()();
							}
							function addListener(taskName, fn) {
								var taskListeners = listeners[taskName];
								if (!taskListeners) taskListeners = listeners[taskName] = [];
								taskListeners.push(fn);
							}
							function taskComplete(taskName) {
								arrayEach(listeners[taskName] || [], function(fn) {
									fn();
								});
								processQueue();
							}
							function runTask(key, task) {
								if (hasError) return;
								var taskCallback = onlyOnce(function(err, result) {
									runningTasks--;
									if (arguments.length > 2) result = slice(arguments, 1);
									if (err) {
										var safeResults = {};
										baseForOwn(results, function(val, rkey) {
											safeResults[rkey] = val;
										});
										safeResults[key] = result;
										hasError = true;
										listeners = Object.create(null);
										callback(err, safeResults);
									} else {
										results[key] = result;
										taskComplete(key);
									}
								});
								runningTasks++;
								var taskFn = wrapAsync(task[task.length - 1]);
								if (task.length > 1) taskFn(results, taskCallback);
								else taskFn(taskCallback);
							}
							function checkForDeadlocks() {
								var currentTask;
								var counter = 0;
								while (readyToCheck.length) {
									currentTask = readyToCheck.pop();
									counter++;
									arrayEach(getDependents(currentTask), function(dependent) {
										if (--uncheckedDependencies[dependent] === 0) readyToCheck.push(dependent);
									});
								}
								if (counter !== numTasks) throw new Error("async.auto cannot execute tasks due to a recursive dependency");
							}
							function getDependents(taskName) {
								var result = [];
								baseForOwn(tasks, function(task, key) {
									if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) result.push(key);
								});
								return result;
							}
						};
						/**
						* A specialized version of `_.map` for arrays without support for iteratee
						* shorthands.
						*
						* @private
						* @param {Array} [array] The array to iterate over.
						* @param {Function} iteratee The function invoked per iteration.
						* @returns {Array} Returns the new mapped array.
						*/
						function arrayMap(array, iteratee) {
							var index = -1, length = array == null ? 0 : array.length, result = Array(length);
							while (++index < length) result[index] = iteratee(array[index], index, array);
							return result;
						}
						/** `Object#toString` result references. */
						var symbolTag = "[object Symbol]";
						/**
						* Checks if `value` is classified as a `Symbol` primitive or object.
						*
						* @static
						* @memberOf _
						* @since 4.0.0
						* @category Lang
						* @param {*} value The value to check.
						* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
						* @example
						*
						* _.isSymbol(Symbol.iterator);
						* // => true
						*
						* _.isSymbol('abc');
						* // => false
						*/
						function isSymbol(value) {
							return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
						}
						/** Used as references for various `Number` constants. */
						var INFINITY = Infinity;
						/** Used to convert symbols to primitives and strings. */
						var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0;
						var symbolToString = symbolProto ? symbolProto.toString : void 0;
						/**
						* The base implementation of `_.toString` which doesn't convert nullish
						* values to empty strings.
						*
						* @private
						* @param {*} value The value to process.
						* @returns {string} Returns the string.
						*/
						function baseToString(value) {
							if (typeof value == "string") return value;
							if (isArray(value)) return arrayMap(value, baseToString) + "";
							if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
							var result = value + "";
							return result == "0" && 1 / value == -INFINITY ? "-0" : result;
						}
						/**
						* The base implementation of `_.slice` without an iteratee call guard.
						*
						* @private
						* @param {Array} array The array to slice.
						* @param {number} [start=0] The start position.
						* @param {number} [end=array.length] The end position.
						* @returns {Array} Returns the slice of `array`.
						*/
						function baseSlice(array, start, end) {
							var index = -1, length = array.length;
							if (start < 0) start = -start > length ? 0 : length + start;
							end = end > length ? length : end;
							if (end < 0) end += length;
							length = start > end ? 0 : end - start >>> 0;
							start >>>= 0;
							var result = Array(length);
							while (++index < length) result[index] = array[index + start];
							return result;
						}
						/**
						* Casts `array` to a slice if it's needed.
						*
						* @private
						* @param {Array} array The array to inspect.
						* @param {number} start The start position.
						* @param {number} [end=array.length] The end position.
						* @returns {Array} Returns the cast slice.
						*/
						function castSlice(array, start, end) {
							var length = array.length;
							end = end === void 0 ? length : end;
							return !start && end >= length ? array : baseSlice(array, start, end);
						}
						/**
						* Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
						* that is not found in the character symbols.
						*
						* @private
						* @param {Array} strSymbols The string symbols to inspect.
						* @param {Array} chrSymbols The character symbols to find.
						* @returns {number} Returns the index of the last unmatched string symbol.
						*/
						function charsEndIndex(strSymbols, chrSymbols) {
							var index = strSymbols.length;
							while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1);
							return index;
						}
						/**
						* Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
						* that is not found in the character symbols.
						*
						* @private
						* @param {Array} strSymbols The string symbols to inspect.
						* @param {Array} chrSymbols The character symbols to find.
						* @returns {number} Returns the index of the first unmatched string symbol.
						*/
						function charsStartIndex(strSymbols, chrSymbols) {
							var index = -1, length = strSymbols.length;
							while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1);
							return index;
						}
						/**
						* Converts an ASCII `string` to an array.
						*
						* @private
						* @param {string} string The string to convert.
						* @returns {Array} Returns the converted array.
						*/
						function asciiToArray(string) {
							return string.split("");
						}
						/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
						var reHasUnicode = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");
						/**
						* Checks if `string` contains Unicode symbols.
						*
						* @private
						* @param {string} string The string to inspect.
						* @returns {boolean} Returns `true` if a symbol is found, else `false`.
						*/
						function hasUnicode(string) {
							return reHasUnicode.test(string);
						}
						/** Used to compose unicode character classes. */
						var rsAstralRange$1 = "\\ud800-\\udfff";
						var rsComboRange$1 = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff";
						var rsVarRange$1 = "\\ufe0e\\ufe0f";
						/** Used to compose unicode capture groups. */
						var rsAstral = "[" + rsAstralRange$1 + "]";
						var rsCombo = "[" + rsComboRange$1 + "]";
						var rsFitz = "\\ud83c[\\udffb-\\udfff]";
						var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
						var rsNonAstral = "[^" + rsAstralRange$1 + "]";
						var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
						var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
						var rsZWJ$1 = "\\u200d";
						/** Used to compose unicode regexes. */
						var reOptMod = rsModifier + "?";
						var rsOptVar = "[" + rsVarRange$1 + "]?";
						var rsOptJoin = "(?:" + rsZWJ$1 + "(?:" + [
							rsNonAstral,
							rsRegional,
							rsSurrPair
						].join("|") + ")" + rsOptVar + reOptMod + ")*";
						var rsSeq = rsOptVar + reOptMod + rsOptJoin;
						var rsSymbol = "(?:" + [
							rsNonAstral + rsCombo + "?",
							rsCombo,
							rsRegional,
							rsSurrPair,
							rsAstral
						].join("|") + ")";
						/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
						var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
						/**
						* Converts a Unicode `string` to an array.
						*
						* @private
						* @param {string} string The string to convert.
						* @returns {Array} Returns the converted array.
						*/
						function unicodeToArray(string) {
							return string.match(reUnicode) || [];
						}
						/**
						* Converts `string` to an array.
						*
						* @private
						* @param {string} string The string to convert.
						* @returns {Array} Returns the converted array.
						*/
						function stringToArray(string) {
							return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
						}
						/**
						* Converts `value` to a string. An empty string is returned for `null`
						* and `undefined` values. The sign of `-0` is preserved.
						*
						* @static
						* @memberOf _
						* @since 4.0.0
						* @category Lang
						* @param {*} value The value to convert.
						* @returns {string} Returns the converted string.
						* @example
						*
						* _.toString(null);
						* // => ''
						*
						* _.toString(-0);
						* // => '-0'
						*
						* _.toString([1, 2, 3]);
						* // => '1,2,3'
						*/
						function toString(value) {
							return value == null ? "" : baseToString(value);
						}
						/** Used to match leading and trailing whitespace. */
						var reTrim = /^\s+|\s+$/g;
						/**
						* Removes leading and trailing whitespace or specified characters from `string`.
						*
						* @static
						* @memberOf _
						* @since 3.0.0
						* @category String
						* @param {string} [string=''] The string to trim.
						* @param {string} [chars=whitespace] The characters to trim.
						* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
						* @returns {string} Returns the trimmed string.
						* @example
						*
						* _.trim('  abc  ');
						* // => 'abc'
						*
						* _.trim('-_-abc-_-', '_-');
						* // => 'abc'
						*
						* _.map(['  foo  ', '  bar  '], _.trim);
						* // => ['foo', 'bar']
						*/
						function trim(string, chars, guard) {
							string = toString(string);
							if (string && (guard || chars === void 0)) return string.replace(reTrim, "");
							if (!string || !(chars = baseToString(chars))) return string;
							var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars);
							return castSlice(strSymbols, charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1).join("");
						}
						var FN_ARGS = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
						var FN_ARG_SPLIT = /,/;
						var FN_ARG = /(=.+)?(\s*)$/;
						var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
						function parseParams(func) {
							func = func.toString().replace(STRIP_COMMENTS, "");
							func = func.match(FN_ARGS)[2].replace(" ", "");
							func = func ? func.split(FN_ARG_SPLIT) : [];
							func = func.map(function(arg) {
								return trim(arg.replace(FN_ARG, ""));
							});
							return func;
						}
						/**
						* A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
						* tasks are specified as parameters to the function, after the usual callback
						* parameter, with the parameter names matching the names of the tasks it
						* depends on. This can provide even more readable task graphs which can be
						* easier to maintain.
						*
						* If a final callback is specified, the task results are similarly injected,
						* specified as named parameters after the initial error parameter.
						*
						* The autoInject function is purely syntactic sugar and its semantics are
						* otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
						*
						* @name autoInject
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.auto]{@link module:ControlFlow.auto}
						* @category Control Flow
						* @param {Object} tasks - An object, each of whose properties is an {@link AsyncFunction} of
						* the form 'func([dependencies...], callback). The object's key of a property
						* serves as the name of the task defined by that property, i.e. can be used
						* when specifying requirements for other tasks.
						* * The `callback` parameter is a `callback(err, result)` which must be called
						*   when finished, passing an `error` (which can be `null`) and the result of
						*   the function's execution. The remaining parameters name other tasks on
						*   which the task is dependent, and the results from those tasks are the
						*   arguments of those parameters.
						* @param {Function} [callback] - An optional callback which is called when all
						* the tasks have been completed. It receives the `err` argument if any `tasks`
						* pass an error to their callback, and a `results` object with any completed
						* task results, similar to `auto`.
						* @example
						*
						* //  The example from `auto` can be rewritten as follows:
						* async.autoInject({
						*     get_data: function(callback) {
						*         // async code to get some data
						*         callback(null, 'data', 'converted to array');
						*     },
						*     make_folder: function(callback) {
						*         // async code to create a directory to store a file in
						*         // this is run at the same time as getting the data
						*         callback(null, 'folder');
						*     },
						*     write_file: function(get_data, make_folder, callback) {
						*         // once there is some data and the directory exists,
						*         // write the data to a file in the directory
						*         callback(null, 'filename');
						*     },
						*     email_link: function(write_file, callback) {
						*         // once the file is written let's email a link to it...
						*         // write_file contains the filename returned by write_file.
						*         callback(null, {'file':write_file, 'email':'user@example.com'});
						*     }
						* }, function(err, results) {
						*     console.log('err = ', err);
						*     console.log('email_link = ', results.email_link);
						* });
						*
						* // If you are using a JS minifier that mangles parameter names, `autoInject`
						* // will not work with plain functions, since the parameter names will be
						* // collapsed to a single letter identifier.  To work around this, you can
						* // explicitly specify the names of the parameters your task function needs
						* // in an array, similar to Angular.js dependency injection.
						*
						* // This still has an advantage over plain `auto`, since the results a task
						* // depends on are still spread into arguments.
						* async.autoInject({
						*     //...
						*     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
						*         callback(null, 'filename');
						*     }],
						*     email_link: ['write_file', function(write_file, callback) {
						*         callback(null, {'file':write_file, 'email':'user@example.com'});
						*     }]
						*     //...
						* }, function(err, results) {
						*     console.log('err = ', err);
						*     console.log('email_link = ', results.email_link);
						* });
						*/
						function autoInject(tasks, callback) {
							var newTasks = {};
							baseForOwn(tasks, function(taskFn, key) {
								var params;
								var fnIsAsync = isAsync(taskFn);
								var hasNoDeps = !fnIsAsync && taskFn.length === 1 || fnIsAsync && taskFn.length === 0;
								if (isArray(taskFn)) {
									params = taskFn.slice(0, -1);
									taskFn = taskFn[taskFn.length - 1];
									newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
								} else if (hasNoDeps) newTasks[key] = taskFn;
								else {
									params = parseParams(taskFn);
									if (taskFn.length === 0 && !fnIsAsync && params.length === 0) throw new Error("autoInject task functions require explicit parameters.");
									if (!fnIsAsync) params.pop();
									newTasks[key] = params.concat(newTask);
								}
								function newTask(results, taskCb) {
									var newArgs = arrayMap(params, function(name) {
										return results[name];
									});
									newArgs.push(taskCb);
									wrapAsync(taskFn).apply(null, newArgs);
								}
							});
							auto(newTasks, callback);
						}
						function DLL() {
							this.head = this.tail = null;
							this.length = 0;
						}
						function setInitial(dll, node) {
							dll.length = 1;
							dll.head = dll.tail = node;
						}
						DLL.prototype.removeLink = function(node) {
							if (node.prev) node.prev.next = node.next;
							else this.head = node.next;
							if (node.next) node.next.prev = node.prev;
							else this.tail = node.prev;
							node.prev = node.next = null;
							this.length -= 1;
							return node;
						};
						DLL.prototype.empty = function() {
							while (this.head) this.shift();
							return this;
						};
						DLL.prototype.insertAfter = function(node, newNode) {
							newNode.prev = node;
							newNode.next = node.next;
							if (node.next) node.next.prev = newNode;
							else this.tail = newNode;
							node.next = newNode;
							this.length += 1;
						};
						DLL.prototype.insertBefore = function(node, newNode) {
							newNode.prev = node.prev;
							newNode.next = node;
							if (node.prev) node.prev.next = newNode;
							else this.head = newNode;
							node.prev = newNode;
							this.length += 1;
						};
						DLL.prototype.unshift = function(node) {
							if (this.head) this.insertBefore(this.head, node);
							else setInitial(this, node);
						};
						DLL.prototype.push = function(node) {
							if (this.tail) this.insertAfter(this.tail, node);
							else setInitial(this, node);
						};
						DLL.prototype.shift = function() {
							return this.head && this.removeLink(this.head);
						};
						DLL.prototype.pop = function() {
							return this.tail && this.removeLink(this.tail);
						};
						DLL.prototype.toArray = function() {
							var arr = Array(this.length);
							var curr = this.head;
							for (var idx = 0; idx < this.length; idx++) {
								arr[idx] = curr.data;
								curr = curr.next;
							}
							return arr;
						};
						DLL.prototype.remove = function(testFn) {
							var curr = this.head;
							while (!!curr) {
								var next = curr.next;
								if (testFn(curr)) this.removeLink(curr);
								curr = next;
							}
							return this;
						};
						function queue(worker, concurrency, payload) {
							if (concurrency == null) concurrency = 1;
							else if (concurrency === 0) throw new Error("Concurrency must not be zero");
							var _worker = wrapAsync(worker);
							var numRunning = 0;
							var workersList = [];
							var processingScheduled = false;
							function _insert(data, insertAtFront, callback) {
								if (callback != null && typeof callback !== "function") throw new Error("task callback must be a function");
								q.started = true;
								if (!isArray(data)) data = [data];
								if (data.length === 0 && q.idle()) return setImmediate$1(function() {
									q.drain();
								});
								for (var i = 0, l = data.length; i < l; i++) {
									var item = {
										data: data[i],
										callback: callback || noop
									};
									if (insertAtFront) q._tasks.unshift(item);
									else q._tasks.push(item);
								}
								if (!processingScheduled) {
									processingScheduled = true;
									setImmediate$1(function() {
										processingScheduled = false;
										q.process();
									});
								}
							}
							function _next(tasks) {
								return function(err) {
									numRunning -= 1;
									for (var i = 0, l = tasks.length; i < l; i++) {
										var task = tasks[i];
										var index = baseIndexOf(workersList, task, 0);
										if (index === 0) workersList.shift();
										else if (index > 0) workersList.splice(index, 1);
										task.callback.apply(task, arguments);
										if (err != null) q.error(err, task.data);
									}
									if (numRunning <= q.concurrency - q.buffer) q.unsaturated();
									if (q.idle()) q.drain();
									q.process();
								};
							}
							var isProcessing = false;
							var q = {
								_tasks: new DLL(),
								concurrency,
								payload,
								saturated: noop,
								unsaturated: noop,
								buffer: concurrency / 4,
								empty: noop,
								drain: noop,
								error: noop,
								started: false,
								paused: false,
								push: function(data, callback) {
									_insert(data, false, callback);
								},
								kill: function() {
									q.drain = noop;
									q._tasks.empty();
								},
								unshift: function(data, callback) {
									_insert(data, true, callback);
								},
								remove: function(testFn) {
									q._tasks.remove(testFn);
								},
								process: function() {
									if (isProcessing) return;
									isProcessing = true;
									while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
										var tasks = [], data = [];
										var l = q._tasks.length;
										if (q.payload) l = Math.min(l, q.payload);
										for (var i = 0; i < l; i++) {
											var node = q._tasks.shift();
											tasks.push(node);
											workersList.push(node);
											data.push(node.data);
										}
										numRunning += 1;
										if (q._tasks.length === 0) q.empty();
										if (numRunning === q.concurrency) q.saturated();
										_worker(data, onlyOnce(_next(tasks)));
									}
									isProcessing = false;
								},
								length: function() {
									return q._tasks.length;
								},
								running: function() {
									return numRunning;
								},
								workersList: function() {
									return workersList;
								},
								idle: function() {
									return q._tasks.length + numRunning === 0;
								},
								pause: function() {
									q.paused = true;
								},
								resume: function() {
									if (q.paused === false) return;
									q.paused = false;
									setImmediate$1(q.process);
								}
							};
							return q;
						}
						/**
						* A cargo of tasks for the worker function to complete. Cargo inherits all of
						* the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
						* @typedef {Object} CargoObject
						* @memberOf module:ControlFlow
						* @property {Function} length - A function returning the number of items
						* waiting to be processed. Invoke like `cargo.length()`.
						* @property {number} payload - An `integer` for determining how many tasks
						* should be process per round. This property can be changed after a `cargo` is
						* created to alter the payload on-the-fly.
						* @property {Function} push - Adds `task` to the `queue`. The callback is
						* called once the `worker` has finished processing the task. Instead of a
						* single task, an array of `tasks` can be submitted. The respective callback is
						* used for every task in the list. Invoke like `cargo.push(task, [callback])`.
						* @property {Function} saturated - A callback that is called when the
						* `queue.length()` hits the concurrency and further tasks will be queued.
						* @property {Function} empty - A callback that is called when the last item
						* from the `queue` is given to a `worker`.
						* @property {Function} drain - A callback that is called when the last item
						* from the `queue` has returned from the `worker`.
						* @property {Function} idle - a function returning false if there are items
						* waiting or being processed, or true if not. Invoke like `cargo.idle()`.
						* @property {Function} pause - a function that pauses the processing of tasks
						* until `resume()` is called. Invoke like `cargo.pause()`.
						* @property {Function} resume - a function that resumes the processing of
						* queued tasks when the queue is paused. Invoke like `cargo.resume()`.
						* @property {Function} kill - a function that removes the `drain` callback and
						* empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
						*/
						/**
						* Creates a `cargo` object with the specified payload. Tasks added to the
						* cargo will be processed altogether (up to the `payload` limit). If the
						* `worker` is in progress, the task is queued until it becomes available. Once
						* the `worker` has completed some tasks, each callback of those tasks is
						* called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
						* for how `cargo` and `queue` work.
						*
						* While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
						* at a time, cargo passes an array of tasks to a single worker, repeating
						* when the worker is finished.
						*
						* @name cargo
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.queue]{@link module:ControlFlow.queue}
						* @category Control Flow
						* @param {AsyncFunction} worker - An asynchronous function for processing an array
						* of queued tasks. Invoked with `(tasks, callback)`.
						* @param {number} [payload=Infinity] - An optional `integer` for determining
						* how many tasks should be processed per round; if omitted, the default is
						* unlimited.
						* @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
						* attached as certain properties to listen for specific events during the
						* lifecycle of the cargo and inner queue.
						* @example
						*
						* // create a cargo object with payload 2
						* var cargo = async.cargo(function(tasks, callback) {
						*     for (var i=0; i<tasks.length; i++) {
						*         console.log('hello ' + tasks[i].name);
						*     }
						*     callback();
						* }, 2);
						*
						* // add some items
						* cargo.push({name: 'foo'}, function(err) {
						*     console.log('finished processing foo');
						* });
						* cargo.push({name: 'bar'}, function(err) {
						*     console.log('finished processing bar');
						* });
						* cargo.push({name: 'baz'}, function(err) {
						*     console.log('finished processing baz');
						* });
						*/
						function cargo(worker, payload) {
							return queue(worker, 1, payload);
						}
						/**
						* The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
						*
						* @name eachOfSeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.eachOf]{@link module:Collections.eachOf}
						* @alias forEachOfSeries
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async function to apply to each item in
						* `coll`.
						* Invoked with (item, key, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. Invoked with (err).
						*/
						var eachOfSeries = doLimit(eachOfLimit, 1);
						/**
						* Reduces `coll` into a single value using an async `iteratee` to return each
						* successive step. `memo` is the initial state of the reduction. This function
						* only operates in series.
						*
						* For performance reasons, it may make sense to split a call to this function
						* into a parallel map, and then use the normal `Array.prototype.reduce` on the
						* results. This function is for situations where each step in the reduction
						* needs to be async; if you can get the data before reducing it, then it's
						* probably a good idea to do so.
						*
						* @name reduce
						* @static
						* @memberOf module:Collections
						* @method
						* @alias inject
						* @alias foldl
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {*} memo - The initial state of the reduction.
						* @param {AsyncFunction} iteratee - A function applied to each item in the
						* array to produce the next step in the reduction.
						* The `iteratee` should complete with the next state of the reduction.
						* If the iteratee complete with an error, the reduction is stopped and the
						* main `callback` is immediately called with the error.
						* Invoked with (memo, item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Result is the reduced value. Invoked with
						* (err, result).
						* @example
						*
						* async.reduce([1,2,3], 0, function(memo, item, callback) {
						*     // pointless async:
						*     process.nextTick(function() {
						*         callback(null, memo + item)
						*     });
						* }, function(err, result) {
						*     // result is now equal to the last value of memo, which is 6
						* });
						*/
						function reduce(coll, memo, iteratee, callback) {
							callback = once(callback || noop);
							var _iteratee = wrapAsync(iteratee);
							eachOfSeries(coll, function(x, i, callback) {
								_iteratee(memo, x, function(err, v) {
									memo = v;
									callback(err);
								});
							}, function(err) {
								callback(err, memo);
							});
						}
						/**
						* Version of the compose function that is more natural to read. Each function
						* consumes the return value of the previous function. It is the equivalent of
						* [compose]{@link module:ControlFlow.compose} with the arguments reversed.
						*
						* Each function is executed with the `this` binding of the composed function.
						*
						* @name seq
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.compose]{@link module:ControlFlow.compose}
						* @category Control Flow
						* @param {...AsyncFunction} functions - the asynchronous functions to compose
						* @returns {Function} a function that composes the `functions` in order
						* @example
						*
						* // Requires lodash (or underscore), express3 and dresende's orm2.
						* // Part of an app, that fetches cats of the logged user.
						* // This example uses `seq` function to avoid overnesting and error
						* // handling clutter.
						* app.get('/cats', function(request, response) {
						*     var User = request.models.User;
						*     async.seq(
						*         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
						*         function(user, fn) {
						*             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
						*         }
						*     )(req.session.user_id, function (err, cats) {
						*         if (err) {
						*             console.error(err);
						*             response.json({ status: 'error', message: err.message });
						*         } else {
						*             response.json({ status: 'ok', message: 'Cats found', data: cats });
						*         }
						*     });
						* });
						*/
						function seq() {
							var _functions = arrayMap(arguments, wrapAsync);
							return function() {
								var args = slice(arguments);
								var that = this;
								var cb = args[args.length - 1];
								if (typeof cb == "function") args.pop();
								else cb = noop;
								reduce(_functions, args, function(newargs, fn, cb) {
									fn.apply(that, newargs.concat(function(err) {
										cb(err, slice(arguments, 1));
									}));
								}, function(err, results) {
									cb.apply(that, [err].concat(results));
								});
							};
						}
						/**
						* Creates a function which is a composition of the passed asynchronous
						* functions. Each function consumes the return value of the function that
						* follows. Composing functions `f()`, `g()`, and `h()` would produce the result
						* of `f(g(h()))`, only this version uses callbacks to obtain the return values.
						*
						* Each function is executed with the `this` binding of the composed function.
						*
						* @name compose
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {...AsyncFunction} functions - the asynchronous functions to compose
						* @returns {Function} an asynchronous function that is the composed
						* asynchronous `functions`
						* @example
						*
						* function add1(n, callback) {
						*     setTimeout(function () {
						*         callback(null, n + 1);
						*     }, 10);
						* }
						*
						* function mul3(n, callback) {
						*     setTimeout(function () {
						*         callback(null, n * 3);
						*     }, 10);
						* }
						*
						* var add1mul3 = async.compose(mul3, add1);
						* add1mul3(4, function (err, result) {
						*     // result now equals 15
						* });
						*/
						var compose = function() {
							return seq.apply(null, slice(arguments).reverse());
						};
						var _concat = Array.prototype.concat;
						/**
						* The same as [`concat`]{@link module:Collections.concat} but runs a maximum of `limit` async operations at a time.
						*
						* @name concatLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.concat]{@link module:Collections.concat}
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
						* which should use an array as its result. Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished, or an error occurs. Results is an array
						* containing the concatenated results of the `iteratee` function. Invoked with
						* (err, results).
						*/
						var concatLimit = function(coll, limit, iteratee, callback) {
							callback = callback || noop;
							var _iteratee = wrapAsync(iteratee);
							mapLimit(coll, limit, function(val, callback) {
								_iteratee(val, function(err) {
									if (err) return callback(err);
									return callback(null, slice(arguments, 1));
								});
							}, function(err, mapResults) {
								var result = [];
								for (var i = 0; i < mapResults.length; i++) if (mapResults[i]) result = _concat.apply(result, mapResults[i]);
								return callback(err, result);
							});
						};
						/**
						* Applies `iteratee` to each item in `coll`, concatenating the results. Returns
						* the concatenated list. The `iteratee`s are called in parallel, and the
						* results are concatenated as they return. There is no guarantee that the
						* results array will be returned in the original order of `coll` passed to the
						* `iteratee` function.
						*
						* @name concat
						* @static
						* @memberOf module:Collections
						* @method
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
						* which should use an array as its result. Invoked with (item, callback).
						* @param {Function} [callback(err)] - A callback which is called after all the
						* `iteratee` functions have finished, or an error occurs. Results is an array
						* containing the concatenated results of the `iteratee` function. Invoked with
						* (err, results).
						* @example
						*
						* async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
						*     // files is now a list of filenames that exist in the 3 directories
						* });
						*/
						var concat = doLimit(concatLimit, Infinity);
						/**
						* The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
						*
						* @name concatSeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.concat]{@link module:Collections.concat}
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - A function to apply to each item in `coll`.
						* The iteratee should complete with an array an array of results.
						* Invoked with (item, callback).
						* @param {Function} [callback(err)] - A callback which is called after all the
						* `iteratee` functions have finished, or an error occurs. Results is an array
						* containing the concatenated results of the `iteratee` function. Invoked with
						* (err, results).
						*/
						var concatSeries = doLimit(concatLimit, 1);
						/**
						* Returns a function that when called, calls-back with the values provided.
						* Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
						* [`auto`]{@link module:ControlFlow.auto}.
						*
						* @name constant
						* @static
						* @memberOf module:Utils
						* @method
						* @category Util
						* @param {...*} arguments... - Any number of arguments to automatically invoke
						* callback with.
						* @returns {AsyncFunction} Returns a function that when invoked, automatically
						* invokes the callback with the previous given arguments.
						* @example
						*
						* async.waterfall([
						*     async.constant(42),
						*     function (value, next) {
						*         // value === 42
						*     },
						*     //...
						* ], callback);
						*
						* async.waterfall([
						*     async.constant(filename, "utf8"),
						*     fs.readFile,
						*     function (fileData, next) {
						*         //...
						*     }
						*     //...
						* ], callback);
						*
						* async.auto({
						*     hostname: async.constant("https://server.net/"),
						*     port: findFreePort,
						*     launchServer: ["hostname", "port", function (options, cb) {
						*         startServer(options, cb);
						*     }],
						*     //...
						* }, callback);
						*/
						var constant = function() {
							var values = slice(arguments);
							var args = [null].concat(values);
							return function() {
								return arguments[arguments.length - 1].apply(this, args);
							};
						};
						/**
						* This method returns the first argument it receives.
						*
						* @static
						* @since 0.1.0
						* @memberOf _
						* @category Util
						* @param {*} value Any value.
						* @returns {*} Returns `value`.
						* @example
						*
						* var object = { 'a': 1 };
						*
						* console.log(_.identity(object) === object);
						* // => true
						*/
						function identity(value) {
							return value;
						}
						function _createTester(check, getResult) {
							return function(eachfn, arr, iteratee, cb) {
								cb = cb || noop;
								var testPassed = false;
								var testResult;
								eachfn(arr, function(value, _, callback) {
									iteratee(value, function(err, result) {
										if (err) callback(err);
										else if (check(result) && !testResult) {
											testPassed = true;
											testResult = getResult(true, value);
											callback(null, breakLoop);
										} else callback();
									});
								}, function(err) {
									if (err) cb(err);
									else cb(null, testPassed ? testResult : getResult(false));
								});
							};
						}
						function _findGetResult(v, x) {
							return x;
						}
						/**
						* Returns the first value in `coll` that passes an async truth test. The
						* `iteratee` is applied in parallel, meaning the first iteratee to return
						* `true` will fire the detect `callback` with that result. That means the
						* result might not be the first item in the original `coll` (in terms of order)
						* that passes the test.
						
						* If order within the original `coll` is important, then look at
						* [`detectSeries`]{@link module:Collections.detectSeries}.
						*
						* @name detect
						* @static
						* @memberOf module:Collections
						* @method
						* @alias find
						* @category Collections
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
						* The iteratee must complete with a boolean value as its result.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called as soon as any
						* iteratee returns `true`, or after all the `iteratee` functions have finished.
						* Result will be the first item in the array that passes the truth test
						* (iteratee) or the value `undefined` if none passed. Invoked with
						* (err, result).
						* @example
						*
						* async.detect(['file1','file2','file3'], function(filePath, callback) {
						*     fs.access(filePath, function(err) {
						*         callback(null, !err)
						*     });
						* }, function(err, result) {
						*     // result now equals the first file in the list that exists
						* });
						*/
						var detect = doParallel(_createTester(identity, _findGetResult));
						/**
						* The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
						* time.
						*
						* @name detectLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.detect]{@link module:Collections.detect}
						* @alias findLimit
						* @category Collections
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
						* The iteratee must complete with a boolean value as its result.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called as soon as any
						* iteratee returns `true`, or after all the `iteratee` functions have finished.
						* Result will be the first item in the array that passes the truth test
						* (iteratee) or the value `undefined` if none passed. Invoked with
						* (err, result).
						*/
						var detectLimit = doParallelLimit(_createTester(identity, _findGetResult));
						/**
						* The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
						*
						* @name detectSeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.detect]{@link module:Collections.detect}
						* @alias findSeries
						* @category Collections
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
						* The iteratee must complete with a boolean value as its result.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called as soon as any
						* iteratee returns `true`, or after all the `iteratee` functions have finished.
						* Result will be the first item in the array that passes the truth test
						* (iteratee) or the value `undefined` if none passed. Invoked with
						* (err, result).
						*/
						var detectSeries = doLimit(detectLimit, 1);
						function consoleFunc(name) {
							return function(fn) {
								var args = slice(arguments, 1);
								args.push(function(err) {
									var args = slice(arguments, 1);
									if (typeof console === "object") {
										if (err) {
											if (console.error) console.error(err);
										} else if (console[name]) arrayEach(args, function(x) {
											console[name](x);
										});
									}
								});
								wrapAsync(fn).apply(null, args);
							};
						}
						/**
						* Logs the result of an [`async` function]{@link AsyncFunction} to the
						* `console` using `console.dir` to display the properties of the resulting object.
						* Only works in Node.js or in browsers that support `console.dir` and
						* `console.error` (such as FF and Chrome).
						* If multiple arguments are returned from the async function,
						* `console.dir` is called on each argument in order.
						*
						* @name dir
						* @static
						* @memberOf module:Utils
						* @method
						* @category Util
						* @param {AsyncFunction} function - The function you want to eventually apply
						* all arguments to.
						* @param {...*} arguments... - Any number of arguments to apply to the function.
						* @example
						*
						* // in a module
						* var hello = function(name, callback) {
						*     setTimeout(function() {
						*         callback(null, {hello: name});
						*     }, 1000);
						* };
						*
						* // in the node repl
						* node> async.dir(hello, 'world');
						* {hello: 'world'}
						*/
						var dir = consoleFunc("dir");
						/**
						* The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
						* the order of operations, the arguments `test` and `fn` are switched.
						*
						* Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
						* @name doDuring
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.during]{@link module:ControlFlow.during}
						* @category Control Flow
						* @param {AsyncFunction} fn - An async function which is called each time
						* `test` passes. Invoked with (callback).
						* @param {AsyncFunction} test - asynchronous truth test to perform before each
						* execution of `fn`. Invoked with (...args, callback), where `...args` are the
						* non-error args from the previous callback of `fn`.
						* @param {Function} [callback] - A callback which is called after the test
						* function has failed and repeated execution of `fn` has stopped. `callback`
						* will be passed an error if one occurred, otherwise `null`.
						*/
						function doDuring(fn, test, callback) {
							callback = onlyOnce(callback || noop);
							var _fn = wrapAsync(fn);
							var _test = wrapAsync(test);
							function next(err) {
								if (err) return callback(err);
								var args = slice(arguments, 1);
								args.push(check);
								_test.apply(this, args);
							}
							function check(err, truth) {
								if (err) return callback(err);
								if (!truth) return callback(null);
								_fn(next);
							}
							check(null, true);
						}
						/**
						* The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
						* the order of operations, the arguments `test` and `iteratee` are switched.
						*
						* `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
						*
						* @name doWhilst
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.whilst]{@link module:ControlFlow.whilst}
						* @category Control Flow
						* @param {AsyncFunction} iteratee - A function which is called each time `test`
						* passes. Invoked with (callback).
						* @param {Function} test - synchronous truth test to perform after each
						* execution of `iteratee`. Invoked with any non-error callback results of
						* `iteratee`.
						* @param {Function} [callback] - A callback which is called after the test
						* function has failed and repeated execution of `iteratee` has stopped.
						* `callback` will be passed an error and any arguments passed to the final
						* `iteratee`'s callback. Invoked with (err, [results]);
						*/
						function doWhilst(iteratee, test, callback) {
							callback = onlyOnce(callback || noop);
							var _iteratee = wrapAsync(iteratee);
							var next = function(err) {
								if (err) return callback(err);
								var args = slice(arguments, 1);
								if (test.apply(this, args)) return _iteratee(next);
								callback.apply(null, [null].concat(args));
							};
							_iteratee(next);
						}
						/**
						* Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
						* argument ordering differs from `until`.
						*
						* @name doUntil
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
						* @category Control Flow
						* @param {AsyncFunction} iteratee - An async function which is called each time
						* `test` fails. Invoked with (callback).
						* @param {Function} test - synchronous truth test to perform after each
						* execution of `iteratee`. Invoked with any non-error callback results of
						* `iteratee`.
						* @param {Function} [callback] - A callback which is called after the test
						* function has passed and repeated execution of `iteratee` has stopped. `callback`
						* will be passed an error and any arguments passed to the final `iteratee`'s
						* callback. Invoked with (err, [results]);
						*/
						function doUntil(iteratee, test, callback) {
							doWhilst(iteratee, function() {
								return !test.apply(this, arguments);
							}, callback);
						}
						/**
						* Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
						* is passed a callback in the form of `function (err, truth)`. If error is
						* passed to `test` or `fn`, the main callback is immediately called with the
						* value of the error.
						*
						* @name during
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.whilst]{@link module:ControlFlow.whilst}
						* @category Control Flow
						* @param {AsyncFunction} test - asynchronous truth test to perform before each
						* execution of `fn`. Invoked with (callback).
						* @param {AsyncFunction} fn - An async function which is called each time
						* `test` passes. Invoked with (callback).
						* @param {Function} [callback] - A callback which is called after the test
						* function has failed and repeated execution of `fn` has stopped. `callback`
						* will be passed an error, if one occurred, otherwise `null`.
						* @example
						*
						* var count = 0;
						*
						* async.during(
						*     function (callback) {
						*         return callback(null, count < 5);
						*     },
						*     function (callback) {
						*         count++;
						*         setTimeout(callback, 1000);
						*     },
						*     function (err) {
						*         // 5 seconds have passed
						*     }
						* );
						*/
						function during(test, fn, callback) {
							callback = onlyOnce(callback || noop);
							var _fn = wrapAsync(fn);
							var _test = wrapAsync(test);
							function next(err) {
								if (err) return callback(err);
								_test(check);
							}
							function check(err, truth) {
								if (err) return callback(err);
								if (!truth) return callback(null);
								_fn(next);
							}
							_test(check);
						}
						function _withoutIndex(iteratee) {
							return function(value, index, callback) {
								return iteratee(value, callback);
							};
						}
						/**
						* Applies the function `iteratee` to each item in `coll`, in parallel.
						* The `iteratee` is called with an item from the list, and a callback for when
						* it has finished. If the `iteratee` passes an error to its `callback`, the
						* main `callback` (for the `each` function) is immediately called with the
						* error.
						*
						* Note, that since this function applies `iteratee` to each item in parallel,
						* there is no guarantee that the iteratee functions will complete in order.
						*
						* @name each
						* @static
						* @memberOf module:Collections
						* @method
						* @alias forEach
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async function to apply to
						* each item in `coll`. Invoked with (item, callback).
						* The array index is not passed to the iteratee.
						* If you need the index, use `eachOf`.
						* @param {Function} [callback] - A callback which is called when all
						* `iteratee` functions have finished, or an error occurs. Invoked with (err).
						* @example
						*
						* // assuming openFiles is an array of file names and saveFile is a function
						* // to save the modified contents of that file:
						*
						* async.each(openFiles, saveFile, function(err){
						*   // if any of the saves produced an error, err would equal that error
						* });
						*
						* // assuming openFiles is an array of file names
						* async.each(openFiles, function(file, callback) {
						*
						*     // Perform operation on file here.
						*     console.log('Processing file ' + file);
						*
						*     if( file.length > 32 ) {
						*       console.log('This file name is too long');
						*       callback('File name too long');
						*     } else {
						*       // Do work to process file here
						*       console.log('File processed');
						*       callback();
						*     }
						* }, function(err) {
						*     // if any of the file processing produced an error, err would equal that error
						*     if( err ) {
						*       // One of the iterations produced an error.
						*       // All processing will now stop.
						*       console.log('A file failed to process');
						*     } else {
						*       console.log('All files have been processed successfully');
						*     }
						* });
						*/
						function eachLimit(coll, iteratee, callback) {
							eachOf(coll, _withoutIndex(wrapAsync(iteratee)), callback);
						}
						/**
						* The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
						*
						* @name eachLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.each]{@link module:Collections.each}
						* @alias forEachLimit
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - An async function to apply to each item in
						* `coll`.
						* The array index is not passed to the iteratee.
						* If you need the index, use `eachOfLimit`.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called when all
						* `iteratee` functions have finished, or an error occurs. Invoked with (err).
						*/
						function eachLimit$1(coll, limit, iteratee, callback) {
							_eachOfLimit(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
						}
						/**
						* The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
						*
						* @name eachSeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.each]{@link module:Collections.each}
						* @alias forEachSeries
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async function to apply to each
						* item in `coll`.
						* The array index is not passed to the iteratee.
						* If you need the index, use `eachOfSeries`.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called when all
						* `iteratee` functions have finished, or an error occurs. Invoked with (err).
						*/
						var eachSeries = doLimit(eachLimit$1, 1);
						/**
						* Wrap an async function and ensure it calls its callback on a later tick of
						* the event loop.  If the function already calls its callback on a next tick,
						* no extra deferral is added. This is useful for preventing stack overflows
						* (`RangeError: Maximum call stack size exceeded`) and generally keeping
						* [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
						* contained. ES2017 `async` functions are returned as-is -- they are immune
						* to Zalgo's corrupting influences, as they always resolve on a later tick.
						*
						* @name ensureAsync
						* @static
						* @memberOf module:Utils
						* @method
						* @category Util
						* @param {AsyncFunction} fn - an async function, one that expects a node-style
						* callback as its last argument.
						* @returns {AsyncFunction} Returns a wrapped function with the exact same call
						* signature as the function passed in.
						* @example
						*
						* function sometimesAsync(arg, callback) {
						*     if (cache[arg]) {
						*         return callback(null, cache[arg]); // this would be synchronous!!
						*     } else {
						*         doSomeIO(arg, callback); // this IO would be asynchronous
						*     }
						* }
						*
						* // this has a risk of stack overflows if many results are cached in a row
						* async.mapSeries(args, sometimesAsync, done);
						*
						* // this will defer sometimesAsync's callback if necessary,
						* // preventing stack overflows
						* async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
						*/
						function ensureAsync(fn) {
							if (isAsync(fn)) return fn;
							return initialParams(function(args, callback) {
								var sync = true;
								args.push(function() {
									var innerArgs = arguments;
									if (sync) setImmediate$1(function() {
										callback.apply(null, innerArgs);
									});
									else callback.apply(null, innerArgs);
								});
								fn.apply(this, args);
								sync = false;
							});
						}
						function notId(v) {
							return !v;
						}
						/**
						* Returns `true` if every element in `coll` satisfies an async test. If any
						* iteratee call returns `false`, the main `callback` is immediately called.
						*
						* @name every
						* @static
						* @memberOf module:Collections
						* @method
						* @alias all
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async truth test to apply to each item
						* in the collection in parallel.
						* The iteratee must complete with a boolean result value.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Result will be either `true` or `false`
						* depending on the values of the async tests. Invoked with (err, result).
						* @example
						*
						* async.every(['file1','file2','file3'], function(filePath, callback) {
						*     fs.access(filePath, function(err) {
						*         callback(null, !err)
						*     });
						* }, function(err, result) {
						*     // if result is true then every file exists
						* });
						*/
						var every = doParallel(_createTester(notId, notId));
						/**
						* The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
						*
						* @name everyLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.every]{@link module:Collections.every}
						* @alias allLimit
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - An async truth test to apply to each item
						* in the collection in parallel.
						* The iteratee must complete with a boolean result value.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Result will be either `true` or `false`
						* depending on the values of the async tests. Invoked with (err, result).
						*/
						var everyLimit = doParallelLimit(_createTester(notId, notId));
						/**
						* The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
						*
						* @name everySeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.every]{@link module:Collections.every}
						* @alias allSeries
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async truth test to apply to each item
						* in the collection in series.
						* The iteratee must complete with a boolean result value.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Result will be either `true` or `false`
						* depending on the values of the async tests. Invoked with (err, result).
						*/
						var everySeries = doLimit(everyLimit, 1);
						/**
						* The base implementation of `_.property` without support for deep paths.
						*
						* @private
						* @param {string} key The key of the property to get.
						* @returns {Function} Returns the new accessor function.
						*/
						function baseProperty(key) {
							return function(object) {
								return object == null ? void 0 : object[key];
							};
						}
						function filterArray(eachfn, arr, iteratee, callback) {
							var truthValues = new Array(arr.length);
							eachfn(arr, function(x, index, callback) {
								iteratee(x, function(err, v) {
									truthValues[index] = !!v;
									callback(err);
								});
							}, function(err) {
								if (err) return callback(err);
								var results = [];
								for (var i = 0; i < arr.length; i++) if (truthValues[i]) results.push(arr[i]);
								callback(null, results);
							});
						}
						function filterGeneric(eachfn, coll, iteratee, callback) {
							var results = [];
							eachfn(coll, function(x, index, callback) {
								iteratee(x, function(err, v) {
									if (err) callback(err);
									else {
										if (v) results.push({
											index,
											value: x
										});
										callback();
									}
								});
							}, function(err) {
								if (err) callback(err);
								else callback(null, arrayMap(results.sort(function(a, b) {
									return a.index - b.index;
								}), baseProperty("value")));
							});
						}
						function _filter(eachfn, coll, iteratee, callback) {
							(isArrayLike(coll) ? filterArray : filterGeneric)(eachfn, coll, wrapAsync(iteratee), callback || noop);
						}
						/**
						* Returns a new array of all the values in `coll` which pass an async truth
						* test. This operation is performed in parallel, but the results array will be
						* in the same order as the original.
						*
						* @name filter
						* @static
						* @memberOf module:Collections
						* @method
						* @alias select
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {Function} iteratee - A truth test to apply to each item in `coll`.
						* The `iteratee` is passed a `callback(err, truthValue)`, which must be called
						* with a boolean argument once it has completed. Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Invoked with (err, results).
						* @example
						*
						* async.filter(['file1','file2','file3'], function(filePath, callback) {
						*     fs.access(filePath, function(err) {
						*         callback(null, !err)
						*     });
						* }, function(err, results) {
						*     // results now equals an array of the existing files
						* });
						*/
						var filter = doParallel(_filter);
						/**
						* The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
						* time.
						*
						* @name filterLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.filter]{@link module:Collections.filter}
						* @alias selectLimit
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {Function} iteratee - A truth test to apply to each item in `coll`.
						* The `iteratee` is passed a `callback(err, truthValue)`, which must be called
						* with a boolean argument once it has completed. Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Invoked with (err, results).
						*/
						var filterLimit = doParallelLimit(_filter);
						/**
						* The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
						*
						* @name filterSeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.filter]{@link module:Collections.filter}
						* @alias selectSeries
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {Function} iteratee - A truth test to apply to each item in `coll`.
						* The `iteratee` is passed a `callback(err, truthValue)`, which must be called
						* with a boolean argument once it has completed. Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Invoked with (err, results)
						*/
						var filterSeries = doLimit(filterLimit, 1);
						/**
						* Calls the asynchronous function `fn` with a callback parameter that allows it
						* to call itself again, in series, indefinitely.
						
						* If an error is passed to the callback then `errback` is called with the
						* error, and execution stops, otherwise it will never be called.
						*
						* @name forever
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {AsyncFunction} fn - an async function to call repeatedly.
						* Invoked with (next).
						* @param {Function} [errback] - when `fn` passes an error to it's callback,
						* this function will be called, and execution stops. Invoked with (err).
						* @example
						*
						* async.forever(
						*     function(next) {
						*         // next is suitable for passing to things that need a callback(err [, whatever]);
						*         // it will result in this function being called again.
						*     },
						*     function(err) {
						*         // if next is called with a value in its first parameter, it will appear
						*         // in here as 'err', and execution will stop.
						*     }
						* );
						*/
						function forever(fn, errback) {
							var done = onlyOnce(errback || noop);
							var task = wrapAsync(ensureAsync(fn));
							function next(err) {
								if (err) return done(err);
								task(next);
							}
							next();
						}
						/**
						* The same as [`groupBy`]{@link module:Collections.groupBy} but runs a maximum of `limit` async operations at a time.
						*
						* @name groupByLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.groupBy]{@link module:Collections.groupBy}
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - An async function to apply to each item in
						* `coll`.
						* The iteratee should complete with a `key` to group the value under.
						* Invoked with (value, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. Result is an `Object` whoses
						* properties are arrays of values which returned the corresponding key.
						*/
						var groupByLimit = function(coll, limit, iteratee, callback) {
							callback = callback || noop;
							var _iteratee = wrapAsync(iteratee);
							mapLimit(coll, limit, function(val, callback) {
								_iteratee(val, function(err, key) {
									if (err) return callback(err);
									return callback(null, {
										key,
										val
									});
								});
							}, function(err, mapResults) {
								var result = {};
								var hasOwnProperty = Object.prototype.hasOwnProperty;
								for (var i = 0; i < mapResults.length; i++) if (mapResults[i]) {
									var key = mapResults[i].key;
									var val = mapResults[i].val;
									if (hasOwnProperty.call(result, key)) result[key].push(val);
									else result[key] = [val];
								}
								return callback(err, result);
							});
						};
						/**
						* Returns a new object, where each value corresponds to an array of items, from
						* `coll`, that returned the corresponding key. That is, the keys of the object
						* correspond to the values passed to the `iteratee` callback.
						*
						* Note: Since this function applies the `iteratee` to each item in parallel,
						* there is no guarantee that the `iteratee` functions will complete in order.
						* However, the values for each key in the `result` will be in the same order as
						* the original `coll`. For Objects, the values will roughly be in the order of
						* the original Objects' keys (but this can vary across JavaScript engines).
						*
						* @name groupBy
						* @static
						* @memberOf module:Collections
						* @method
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async function to apply to each item in
						* `coll`.
						* The iteratee should complete with a `key` to group the value under.
						* Invoked with (value, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. Result is an `Object` whoses
						* properties are arrays of values which returned the corresponding key.
						* @example
						*
						* async.groupBy(['userId1', 'userId2', 'userId3'], function(userId, callback) {
						*     db.findById(userId, function(err, user) {
						*         if (err) return callback(err);
						*         return callback(null, user.age);
						*     });
						* }, function(err, result) {
						*     // result is object containing the userIds grouped by age
						*     // e.g. { 30: ['userId1', 'userId3'], 42: ['userId2']};
						* });
						*/
						var groupBy = doLimit(groupByLimit, Infinity);
						/**
						* The same as [`groupBy`]{@link module:Collections.groupBy} but runs only a single async operation at a time.
						*
						* @name groupBySeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.groupBy]{@link module:Collections.groupBy}
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - An async function to apply to each item in
						* `coll`.
						* The iteratee should complete with a `key` to group the value under.
						* Invoked with (value, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. Result is an `Object` whoses
						* properties are arrays of values which returned the corresponding key.
						*/
						var groupBySeries = doLimit(groupByLimit, 1);
						/**
						* Logs the result of an `async` function to the `console`. Only works in
						* Node.js or in browsers that support `console.log` and `console.error` (such
						* as FF and Chrome). If multiple arguments are returned from the async
						* function, `console.log` is called on each argument in order.
						*
						* @name log
						* @static
						* @memberOf module:Utils
						* @method
						* @category Util
						* @param {AsyncFunction} function - The function you want to eventually apply
						* all arguments to.
						* @param {...*} arguments... - Any number of arguments to apply to the function.
						* @example
						*
						* // in a module
						* var hello = function(name, callback) {
						*     setTimeout(function() {
						*         callback(null, 'hello ' + name);
						*     }, 1000);
						* };
						*
						* // in the node repl
						* node> async.log(hello, 'world');
						* 'hello world'
						*/
						var log = consoleFunc("log");
						/**
						* The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
						* time.
						*
						* @name mapValuesLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.mapValues]{@link module:Collections.mapValues}
						* @category Collection
						* @param {Object} obj - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - A function to apply to each value and key
						* in `coll`.
						* The iteratee should complete with the transformed value as its result.
						* Invoked with (value, key, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. `result` is a new object consisting
						* of each key from `obj`, with each transformed value on the right-hand side.
						* Invoked with (err, result).
						*/
						function mapValuesLimit(obj, limit, iteratee, callback) {
							callback = once(callback || noop);
							var newObj = {};
							var _iteratee = wrapAsync(iteratee);
							eachOfLimit(obj, limit, function(val, key, next) {
								_iteratee(val, key, function(err, result) {
									if (err) return next(err);
									newObj[key] = result;
									next();
								});
							}, function(err) {
								callback(err, newObj);
							});
						}
						/**
						* A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
						*
						* Produces a new Object by mapping each value of `obj` through the `iteratee`
						* function. The `iteratee` is called each `value` and `key` from `obj` and a
						* callback for when it has finished processing. Each of these callbacks takes
						* two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
						* passes an error to its callback, the main `callback` (for the `mapValues`
						* function) is immediately called with the error.
						*
						* Note, the order of the keys in the result is not guaranteed.  The keys will
						* be roughly in the order they complete, (but this is very engine-specific)
						*
						* @name mapValues
						* @static
						* @memberOf module:Collections
						* @method
						* @category Collection
						* @param {Object} obj - A collection to iterate over.
						* @param {AsyncFunction} iteratee - A function to apply to each value and key
						* in `coll`.
						* The iteratee should complete with the transformed value as its result.
						* Invoked with (value, key, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. `result` is a new object consisting
						* of each key from `obj`, with each transformed value on the right-hand side.
						* Invoked with (err, result).
						* @example
						*
						* async.mapValues({
						*     f1: 'file1',
						*     f2: 'file2',
						*     f3: 'file3'
						* }, function (file, key, callback) {
						*   fs.stat(file, callback);
						* }, function(err, result) {
						*     // result is now a map of stats for each file, e.g.
						*     // {
						*     //     f1: [stats for file1],
						*     //     f2: [stats for file2],
						*     //     f3: [stats for file3]
						*     // }
						* });
						*/
						var mapValues = doLimit(mapValuesLimit, Infinity);
						/**
						* The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
						*
						* @name mapValuesSeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.mapValues]{@link module:Collections.mapValues}
						* @category Collection
						* @param {Object} obj - A collection to iterate over.
						* @param {AsyncFunction} iteratee - A function to apply to each value and key
						* in `coll`.
						* The iteratee should complete with the transformed value as its result.
						* Invoked with (value, key, callback).
						* @param {Function} [callback] - A callback which is called when all `iteratee`
						* functions have finished, or an error occurs. `result` is a new object consisting
						* of each key from `obj`, with each transformed value on the right-hand side.
						* Invoked with (err, result).
						*/
						var mapValuesSeries = doLimit(mapValuesLimit, 1);
						function has(obj, key) {
							return key in obj;
						}
						/**
						* Caches the results of an async function. When creating a hash to store
						* function results against, the callback is omitted from the hash and an
						* optional hash function can be used.
						*
						* If no hash function is specified, the first argument is used as a hash key,
						* which may work reasonably if it is a string or a data type that converts to a
						* distinct string. Note that objects and arrays will not behave reasonably.
						* Neither will cases where the other arguments are significant. In such cases,
						* specify your own hash function.
						*
						* The cache of results is exposed as the `memo` property of the function
						* returned by `memoize`.
						*
						* @name memoize
						* @static
						* @memberOf module:Utils
						* @method
						* @category Util
						* @param {AsyncFunction} fn - The async function to proxy and cache results from.
						* @param {Function} hasher - An optional function for generating a custom hash
						* for storing results. It has all the arguments applied to it apart from the
						* callback, and must be synchronous.
						* @returns {AsyncFunction} a memoized version of `fn`
						* @example
						*
						* var slow_fn = function(name, callback) {
						*     // do something
						*     callback(null, result);
						* };
						* var fn = async.memoize(slow_fn);
						*
						* // fn can now be used as if it were slow_fn
						* fn('some name', function() {
						*     // callback
						* });
						*/
						function memoize(fn, hasher) {
							var memo = Object.create(null);
							var queues = Object.create(null);
							hasher = hasher || identity;
							var _fn = wrapAsync(fn);
							var memoized = initialParams(function memoized(args, callback) {
								var key = hasher.apply(null, args);
								if (has(memo, key)) setImmediate$1(function() {
									callback.apply(null, memo[key]);
								});
								else if (has(queues, key)) queues[key].push(callback);
								else {
									queues[key] = [callback];
									_fn.apply(null, args.concat(function() {
										var args = slice(arguments);
										memo[key] = args;
										var q = queues[key];
										delete queues[key];
										for (var i = 0, l = q.length; i < l; i++) q[i].apply(null, args);
									}));
								}
							});
							memoized.memo = memo;
							memoized.unmemoized = fn;
							return memoized;
						}
						/**
						* Calls `callback` on a later loop around the event loop. In Node.js this just
						* calls `process.nextTicl`.  In the browser it will use `setImmediate` if
						* available, otherwise `setTimeout(callback, 0)`, which means other higher
						* priority events may precede the execution of `callback`.
						*
						* This is used internally for browser-compatibility purposes.
						*
						* @name nextTick
						* @static
						* @memberOf module:Utils
						* @method
						* @see [async.setImmediate]{@link module:Utils.setImmediate}
						* @category Util
						* @param {Function} callback - The function to call on a later loop around
						* the event loop. Invoked with (args...).
						* @param {...*} args... - any number of additional arguments to pass to the
						* callback on the next tick.
						* @example
						*
						* var call_order = [];
						* async.nextTick(function() {
						*     call_order.push('two');
						*     // call_order now equals ['one','two']
						* });
						* call_order.push('one');
						*
						* async.setImmediate(function (a, b, c) {
						*     // a, b, and c equal 1, 2, and 3
						* }, 1, 2, 3);
						*/
						var _defer$1;
						if (hasNextTick) _defer$1 = process.nextTick;
						else if (hasSetImmediate) _defer$1 = setImmediate;
						else _defer$1 = fallback;
						var nextTick = wrap(_defer$1);
						function _parallel(eachfn, tasks, callback) {
							callback = callback || noop;
							var results = isArrayLike(tasks) ? [] : {};
							eachfn(tasks, function(task, key, callback) {
								wrapAsync(task)(function(err, result) {
									if (arguments.length > 2) result = slice(arguments, 1);
									results[key] = result;
									callback(err);
								});
							}, function(err) {
								callback(err, results);
							});
						}
						/**
						* Run the `tasks` collection of functions in parallel, without waiting until
						* the previous function has completed. If any of the functions pass an error to
						* its callback, the main `callback` is immediately called with the value of the
						* error. Once the `tasks` have completed, the results are passed to the final
						* `callback` as an array.
						*
						* **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
						* parallel execution of code.  If your tasks do not use any timers or perform
						* any I/O, they will actually be executed in series.  Any synchronous setup
						* sections for each task will happen one after the other.  JavaScript remains
						* single-threaded.
						*
						* **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
						* execution of other tasks when a task fails.
						*
						* It is also possible to use an object instead of an array. Each property will
						* be run as a function and the results will be passed to the final `callback`
						* as an object instead of an array. This can be a more readable way of handling
						* results from {@link async.parallel}.
						*
						* @name parallel
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {Array|Iterable|Object} tasks - A collection of
						* [async functions]{@link AsyncFunction} to run.
						* Each async function can complete with any number of optional `result` values.
						* @param {Function} [callback] - An optional callback to run once all the
						* functions have completed successfully. This function gets a results array
						* (or object) containing all the result arguments passed to the task callbacks.
						* Invoked with (err, results).
						*
						* @example
						* async.parallel([
						*     function(callback) {
						*         setTimeout(function() {
						*             callback(null, 'one');
						*         }, 200);
						*     },
						*     function(callback) {
						*         setTimeout(function() {
						*             callback(null, 'two');
						*         }, 100);
						*     }
						* ],
						* // optional callback
						* function(err, results) {
						*     // the results array will equal ['one','two'] even though
						*     // the second function had a shorter timeout.
						* });
						*
						* // an example using an object instead of an array
						* async.parallel({
						*     one: function(callback) {
						*         setTimeout(function() {
						*             callback(null, 1);
						*         }, 200);
						*     },
						*     two: function(callback) {
						*         setTimeout(function() {
						*             callback(null, 2);
						*         }, 100);
						*     }
						* }, function(err, results) {
						*     // results is now equals to: {one: 1, two: 2}
						* });
						*/
						function parallelLimit(tasks, callback) {
							_parallel(eachOf, tasks, callback);
						}
						/**
						* The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
						* time.
						*
						* @name parallelLimit
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.parallel]{@link module:ControlFlow.parallel}
						* @category Control Flow
						* @param {Array|Iterable|Object} tasks - A collection of
						* [async functions]{@link AsyncFunction} to run.
						* Each async function can complete with any number of optional `result` values.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {Function} [callback] - An optional callback to run once all the
						* functions have completed successfully. This function gets a results array
						* (or object) containing all the result arguments passed to the task callbacks.
						* Invoked with (err, results).
						*/
						function parallelLimit$1(tasks, limit, callback) {
							_parallel(_eachOfLimit(limit), tasks, callback);
						}
						/**
						* A queue of tasks for the worker function to complete.
						* @typedef {Object} QueueObject
						* @memberOf module:ControlFlow
						* @property {Function} length - a function returning the number of items
						* waiting to be processed. Invoke with `queue.length()`.
						* @property {boolean} started - a boolean indicating whether or not any
						* items have been pushed and processed by the queue.
						* @property {Function} running - a function returning the number of items
						* currently being processed. Invoke with `queue.running()`.
						* @property {Function} workersList - a function returning the array of items
						* currently being processed. Invoke with `queue.workersList()`.
						* @property {Function} idle - a function returning false if there are items
						* waiting or being processed, or true if not. Invoke with `queue.idle()`.
						* @property {number} concurrency - an integer for determining how many `worker`
						* functions should be run in parallel. This property can be changed after a
						* `queue` is created to alter the concurrency on-the-fly.
						* @property {Function} push - add a new task to the `queue`. Calls `callback`
						* once the `worker` has finished processing the task. Instead of a single task,
						* a `tasks` array can be submitted. The respective callback is used for every
						* task in the list. Invoke with `queue.push(task, [callback])`,
						* @property {Function} unshift - add a new task to the front of the `queue`.
						* Invoke with `queue.unshift(task, [callback])`.
						* @property {Function} remove - remove items from the queue that match a test
						* function.  The test function will be passed an object with a `data` property,
						* and a `priority` property, if this is a
						* [priorityQueue]{@link module:ControlFlow.priorityQueue} object.
						* Invoked with `queue.remove(testFn)`, where `testFn` is of the form
						* `function ({data, priority}) {}` and returns a Boolean.
						* @property {Function} saturated - a callback that is called when the number of
						* running workers hits the `concurrency` limit, and further tasks will be
						* queued.
						* @property {Function} unsaturated - a callback that is called when the number
						* of running workers is less than the `concurrency` & `buffer` limits, and
						* further tasks will not be queued.
						* @property {number} buffer - A minimum threshold buffer in order to say that
						* the `queue` is `unsaturated`.
						* @property {Function} empty - a callback that is called when the last item
						* from the `queue` is given to a `worker`.
						* @property {Function} drain - a callback that is called when the last item
						* from the `queue` has returned from the `worker`.
						* @property {Function} error - a callback that is called when a task errors.
						* Has the signature `function(error, task)`.
						* @property {boolean} paused - a boolean for determining whether the queue is
						* in a paused state.
						* @property {Function} pause - a function that pauses the processing of tasks
						* until `resume()` is called. Invoke with `queue.pause()`.
						* @property {Function} resume - a function that resumes the processing of
						* queued tasks when the queue is paused. Invoke with `queue.resume()`.
						* @property {Function} kill - a function that removes the `drain` callback and
						* empties remaining tasks from the queue forcing it to go idle. No more tasks
						* should be pushed to the queue after calling this function. Invoke with `queue.kill()`.
						*/
						/**
						* Creates a `queue` object with the specified `concurrency`. Tasks added to the
						* `queue` are processed in parallel (up to the `concurrency` limit). If all
						* `worker`s are in progress, the task is queued until one becomes available.
						* Once a `worker` completes a `task`, that `task`'s callback is called.
						*
						* @name queue
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {AsyncFunction} worker - An async function for processing a queued task.
						* If you want to handle errors from an individual task, pass a callback to
						* `q.push()`. Invoked with (task, callback).
						* @param {number} [concurrency=1] - An `integer` for determining how many
						* `worker` functions should be run in parallel.  If omitted, the concurrency
						* defaults to `1`.  If the concurrency is `0`, an error is thrown.
						* @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
						* attached as certain properties to listen for specific events during the
						* lifecycle of the queue.
						* @example
						*
						* // create a queue object with concurrency 2
						* var q = async.queue(function(task, callback) {
						*     console.log('hello ' + task.name);
						*     callback();
						* }, 2);
						*
						* // assign a callback
						* q.drain = function() {
						*     console.log('all items have been processed');
						* };
						*
						* // add some items to the queue
						* q.push({name: 'foo'}, function(err) {
						*     console.log('finished processing foo');
						* });
						* q.push({name: 'bar'}, function (err) {
						*     console.log('finished processing bar');
						* });
						*
						* // add some items to the queue (batch-wise)
						* q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
						*     console.log('finished processing item');
						* });
						*
						* // add some items to the front of the queue
						* q.unshift({name: 'bar'}, function (err) {
						*     console.log('finished processing bar');
						* });
						*/
						var queue$1 = function(worker, concurrency) {
							var _worker = wrapAsync(worker);
							return queue(function(items, cb) {
								_worker(items[0], cb);
							}, concurrency, 1);
						};
						/**
						* The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
						* completed in ascending priority order.
						*
						* @name priorityQueue
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.queue]{@link module:ControlFlow.queue}
						* @category Control Flow
						* @param {AsyncFunction} worker - An async function for processing a queued task.
						* If you want to handle errors from an individual task, pass a callback to
						* `q.push()`.
						* Invoked with (task, callback).
						* @param {number} concurrency - An `integer` for determining how many `worker`
						* functions should be run in parallel.  If omitted, the concurrency defaults to
						* `1`.  If the concurrency is `0`, an error is thrown.
						* @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
						* differences between `queue` and `priorityQueue` objects:
						* * `push(task, priority, [callback])` - `priority` should be a number. If an
						*   array of `tasks` is given, all tasks will be assigned the same priority.
						* * The `unshift` method was removed.
						*/
						var priorityQueue = function(worker, concurrency) {
							var q = queue$1(worker, concurrency);
							q.push = function(data, priority, callback) {
								if (callback == null) callback = noop;
								if (typeof callback !== "function") throw new Error("task callback must be a function");
								q.started = true;
								if (!isArray(data)) data = [data];
								if (data.length === 0) return setImmediate$1(function() {
									q.drain();
								});
								priority = priority || 0;
								var nextNode = q._tasks.head;
								while (nextNode && priority >= nextNode.priority) nextNode = nextNode.next;
								for (var i = 0, l = data.length; i < l; i++) {
									var item = {
										data: data[i],
										priority,
										callback
									};
									if (nextNode) q._tasks.insertBefore(nextNode, item);
									else q._tasks.push(item);
								}
								setImmediate$1(q.process);
							};
							delete q.unshift;
							return q;
						};
						/**
						* Runs the `tasks` array of functions in parallel, without waiting until the
						* previous function has completed. Once any of the `tasks` complete or pass an
						* error to its callback, the main `callback` is immediately called. It's
						* equivalent to `Promise.race()`.
						*
						* @name race
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {Array} tasks - An array containing [async functions]{@link AsyncFunction}
						* to run. Each function can complete with an optional `result` value.
						* @param {Function} callback - A callback to run once any of the functions have
						* completed. This function gets an error or result from the first function that
						* completed. Invoked with (err, result).
						* @returns undefined
						* @example
						*
						* async.race([
						*     function(callback) {
						*         setTimeout(function() {
						*             callback(null, 'one');
						*         }, 200);
						*     },
						*     function(callback) {
						*         setTimeout(function() {
						*             callback(null, 'two');
						*         }, 100);
						*     }
						* ],
						* // main callback
						* function(err, result) {
						*     // the result will be equal to 'two' as it finishes earlier
						* });
						*/
						function race(tasks, callback) {
							callback = once(callback || noop);
							if (!isArray(tasks)) return callback(/* @__PURE__ */ new TypeError("First argument to race must be an array of functions"));
							if (!tasks.length) return callback();
							for (var i = 0, l = tasks.length; i < l; i++) wrapAsync(tasks[i])(callback);
						}
						/**
						* Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
						*
						* @name reduceRight
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.reduce]{@link module:Collections.reduce}
						* @alias foldr
						* @category Collection
						* @param {Array} array - A collection to iterate over.
						* @param {*} memo - The initial state of the reduction.
						* @param {AsyncFunction} iteratee - A function applied to each item in the
						* array to produce the next step in the reduction.
						* The `iteratee` should complete with the next state of the reduction.
						* If the iteratee complete with an error, the reduction is stopped and the
						* main `callback` is immediately called with the error.
						* Invoked with (memo, item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Result is the reduced value. Invoked with
						* (err, result).
						*/
						function reduceRight(array, memo, iteratee, callback) {
							reduce(slice(array).reverse(), memo, iteratee, callback);
						}
						/**
						* Wraps the async function in another function that always completes with a
						* result object, even when it errors.
						*
						* The result object has either the property `error` or `value`.
						*
						* @name reflect
						* @static
						* @memberOf module:Utils
						* @method
						* @category Util
						* @param {AsyncFunction} fn - The async function you want to wrap
						* @returns {Function} - A function that always passes null to it's callback as
						* the error. The second argument to the callback will be an `object` with
						* either an `error` or a `value` property.
						* @example
						*
						* async.parallel([
						*     async.reflect(function(callback) {
						*         // do some stuff ...
						*         callback(null, 'one');
						*     }),
						*     async.reflect(function(callback) {
						*         // do some more stuff but error ...
						*         callback('bad stuff happened');
						*     }),
						*     async.reflect(function(callback) {
						*         // do some more stuff ...
						*         callback(null, 'two');
						*     })
						* ],
						* // optional callback
						* function(err, results) {
						*     // values
						*     // results[0].value = 'one'
						*     // results[1].error = 'bad stuff happened'
						*     // results[2].value = 'two'
						* });
						*/
						function reflect(fn) {
							var _fn = wrapAsync(fn);
							return initialParams(function reflectOn(args, reflectCallback) {
								args.push(function callback(error, cbArg) {
									if (error) reflectCallback(null, { error });
									else {
										var value;
										if (arguments.length <= 2) value = cbArg;
										else value = slice(arguments, 1);
										reflectCallback(null, { value });
									}
								});
								return _fn.apply(this, args);
							});
						}
						/**
						* A helper function that wraps an array or an object of functions with `reflect`.
						*
						* @name reflectAll
						* @static
						* @memberOf module:Utils
						* @method
						* @see [async.reflect]{@link module:Utils.reflect}
						* @category Util
						* @param {Array|Object|Iterable} tasks - The collection of
						* [async functions]{@link AsyncFunction} to wrap in `async.reflect`.
						* @returns {Array} Returns an array of async functions, each wrapped in
						* `async.reflect`
						* @example
						*
						* let tasks = [
						*     function(callback) {
						*         setTimeout(function() {
						*             callback(null, 'one');
						*         }, 200);
						*     },
						*     function(callback) {
						*         // do some more stuff but error ...
						*         callback(new Error('bad stuff happened'));
						*     },
						*     function(callback) {
						*         setTimeout(function() {
						*             callback(null, 'two');
						*         }, 100);
						*     }
						* ];
						*
						* async.parallel(async.reflectAll(tasks),
						* // optional callback
						* function(err, results) {
						*     // values
						*     // results[0].value = 'one'
						*     // results[1].error = Error('bad stuff happened')
						*     // results[2].value = 'two'
						* });
						*
						* // an example using an object instead of an array
						* let tasks = {
						*     one: function(callback) {
						*         setTimeout(function() {
						*             callback(null, 'one');
						*         }, 200);
						*     },
						*     two: function(callback) {
						*         callback('two');
						*     },
						*     three: function(callback) {
						*         setTimeout(function() {
						*             callback(null, 'three');
						*         }, 100);
						*     }
						* };
						*
						* async.parallel(async.reflectAll(tasks),
						* // optional callback
						* function(err, results) {
						*     // values
						*     // results.one.value = 'one'
						*     // results.two.error = 'two'
						*     // results.three.value = 'three'
						* });
						*/
						function reflectAll(tasks) {
							var results;
							if (isArray(tasks)) results = arrayMap(tasks, reflect);
							else {
								results = {};
								baseForOwn(tasks, function(task, key) {
									results[key] = reflect.call(this, task);
								});
							}
							return results;
						}
						function reject$1(eachfn, arr, iteratee, callback) {
							_filter(eachfn, arr, function(value, cb) {
								iteratee(value, function(err, v) {
									cb(err, !v);
								});
							}, callback);
						}
						/**
						* The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
						*
						* @name reject
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.filter]{@link module:Collections.filter}
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {Function} iteratee - An async truth test to apply to each item in
						* `coll`.
						* The should complete with a boolean value as its `result`.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Invoked with (err, results).
						* @example
						*
						* async.reject(['file1','file2','file3'], function(filePath, callback) {
						*     fs.access(filePath, function(err) {
						*         callback(null, !err)
						*     });
						* }, function(err, results) {
						*     // results now equals an array of missing files
						*     createFiles(results);
						* });
						*/
						var reject = doParallel(reject$1);
						/**
						* The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
						* time.
						*
						* @name rejectLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.reject]{@link module:Collections.reject}
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {Function} iteratee - An async truth test to apply to each item in
						* `coll`.
						* The should complete with a boolean value as its `result`.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Invoked with (err, results).
						*/
						var rejectLimit = doParallelLimit(reject$1);
						/**
						* The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
						*
						* @name rejectSeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.reject]{@link module:Collections.reject}
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {Function} iteratee - An async truth test to apply to each item in
						* `coll`.
						* The should complete with a boolean value as its `result`.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Invoked with (err, results).
						*/
						var rejectSeries = doLimit(rejectLimit, 1);
						/**
						* Creates a function that returns `value`.
						*
						* @static
						* @memberOf _
						* @since 2.4.0
						* @category Util
						* @param {*} value The value to return from the new function.
						* @returns {Function} Returns the new constant function.
						* @example
						*
						* var objects = _.times(2, _.constant({ 'a': 1 }));
						*
						* console.log(objects);
						* // => [{ 'a': 1 }, { 'a': 1 }]
						*
						* console.log(objects[0] === objects[1]);
						* // => true
						*/
						function constant$1(value) {
							return function() {
								return value;
							};
						}
						/**
						* Attempts to get a successful response from `task` no more than `times` times
						* before returning an error. If the task is successful, the `callback` will be
						* passed the result of the successful task. If all attempts fail, the callback
						* will be passed the error and result (if any) of the final attempt.
						*
						* @name retry
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @see [async.retryable]{@link module:ControlFlow.retryable}
						* @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
						* object with `times` and `interval` or a number.
						* * `times` - The number of attempts to make before giving up.  The default
						*   is `5`.
						* * `interval` - The time to wait between retries, in milliseconds.  The
						*   default is `0`. The interval may also be specified as a function of the
						*   retry count (see example).
						* * `errorFilter` - An optional synchronous function that is invoked on
						*   erroneous result. If it returns `true` the retry attempts will continue;
						*   if the function returns `false` the retry flow is aborted with the current
						*   attempt's error and result being returned to the final callback.
						*   Invoked with (err).
						* * If `opts` is a number, the number specifies the number of times to retry,
						*   with the default interval of `0`.
						* @param {AsyncFunction} task - An async function to retry.
						* Invoked with (callback).
						* @param {Function} [callback] - An optional callback which is called when the
						* task has succeeded, or after the final failed attempt. It receives the `err`
						* and `result` arguments of the last attempt at completing the `task`. Invoked
						* with (err, results).
						*
						* @example
						*
						* // The `retry` function can be used as a stand-alone control flow by passing
						* // a callback, as shown below:
						*
						* // try calling apiMethod 3 times
						* async.retry(3, apiMethod, function(err, result) {
						*     // do something with the result
						* });
						*
						* // try calling apiMethod 3 times, waiting 200 ms between each retry
						* async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
						*     // do something with the result
						* });
						*
						* // try calling apiMethod 10 times with exponential backoff
						* // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
						* async.retry({
						*   times: 10,
						*   interval: function(retryCount) {
						*     return 50 * Math.pow(2, retryCount);
						*   }
						* }, apiMethod, function(err, result) {
						*     // do something with the result
						* });
						*
						* // try calling apiMethod the default 5 times no delay between each retry
						* async.retry(apiMethod, function(err, result) {
						*     // do something with the result
						* });
						*
						* // try calling apiMethod only when error condition satisfies, all other
						* // errors will abort the retry control flow and return to final callback
						* async.retry({
						*   errorFilter: function(err) {
						*     return err.message === 'Temporary error'; // only retry on a specific error
						*   }
						* }, apiMethod, function(err, result) {
						*     // do something with the result
						* });
						*
						* // to retry individual methods that are not as reliable within other
						* // control flow functions, use the `retryable` wrapper:
						* async.auto({
						*     users: api.getUsers.bind(api),
						*     payments: async.retryable(3, api.getPayments.bind(api))
						* }, function(err, results) {
						*     // do something with the results
						* });
						*
						*/
						function retry(opts, task, callback) {
							var DEFAULT_TIMES = 5;
							var DEFAULT_INTERVAL = 0;
							var options = {
								times: DEFAULT_TIMES,
								intervalFunc: constant$1(DEFAULT_INTERVAL)
							};
							function parseTimes(acc, t) {
								if (typeof t === "object") {
									acc.times = +t.times || DEFAULT_TIMES;
									acc.intervalFunc = typeof t.interval === "function" ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);
									acc.errorFilter = t.errorFilter;
								} else if (typeof t === "number" || typeof t === "string") acc.times = +t || DEFAULT_TIMES;
								else throw new Error("Invalid arguments for async.retry");
							}
							if (arguments.length < 3 && typeof opts === "function") {
								callback = task || noop;
								task = opts;
							} else {
								parseTimes(options, opts);
								callback = callback || noop;
							}
							if (typeof task !== "function") throw new Error("Invalid arguments for async.retry");
							var _task = wrapAsync(task);
							var attempt = 1;
							function retryAttempt() {
								_task(function(err) {
									if (err && attempt++ < options.times && (typeof options.errorFilter != "function" || options.errorFilter(err))) setTimeout(retryAttempt, options.intervalFunc(attempt));
									else callback.apply(null, arguments);
								});
							}
							retryAttempt();
						}
						/**
						* A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method
						* wraps a task and makes it retryable, rather than immediately calling it
						* with retries.
						*
						* @name retryable
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.retry]{@link module:ControlFlow.retry}
						* @category Control Flow
						* @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
						* options, exactly the same as from `retry`
						* @param {AsyncFunction} task - the asynchronous function to wrap.
						* This function will be passed any arguments passed to the returned wrapper.
						* Invoked with (...args, callback).
						* @returns {AsyncFunction} The wrapped function, which when invoked, will
						* retry on an error, based on the parameters specified in `opts`.
						* This function will accept the same parameters as `task`.
						* @example
						*
						* async.auto({
						*     dep1: async.retryable(3, getFromFlakyService),
						*     process: ["dep1", async.retryable(3, function (results, cb) {
						*         maybeProcessData(results.dep1, cb);
						*     })]
						* }, callback);
						*/
						var retryable = function(opts, task) {
							if (!task) {
								task = opts;
								opts = null;
							}
							var _task = wrapAsync(task);
							return initialParams(function(args, callback) {
								function taskFn(cb) {
									_task.apply(null, args.concat(cb));
								}
								if (opts) retry(opts, taskFn, callback);
								else retry(taskFn, callback);
							});
						};
						/**
						* Run the functions in the `tasks` collection in series, each one running once
						* the previous function has completed. If any functions in the series pass an
						* error to its callback, no more functions are run, and `callback` is
						* immediately called with the value of the error. Otherwise, `callback`
						* receives an array of results when `tasks` have completed.
						*
						* It is also possible to use an object instead of an array. Each property will
						* be run as a function, and the results will be passed to the final `callback`
						* as an object instead of an array. This can be a more readable way of handling
						*  results from {@link async.series}.
						*
						* **Note** that while many implementations preserve the order of object
						* properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
						* explicitly states that
						*
						* > The mechanics and order of enumerating the properties is not specified.
						*
						* So if you rely on the order in which your series of functions are executed,
						* and want this to work on all platforms, consider using an array.
						*
						* @name series
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {Array|Iterable|Object} tasks - A collection containing
						* [async functions]{@link AsyncFunction} to run in series.
						* Each function can complete with any number of optional `result` values.
						* @param {Function} [callback] - An optional callback to run once all the
						* functions have completed. This function gets a results array (or object)
						* containing all the result arguments passed to the `task` callbacks. Invoked
						* with (err, result).
						* @example
						* async.series([
						*     function(callback) {
						*         // do some stuff ...
						*         callback(null, 'one');
						*     },
						*     function(callback) {
						*         // do some more stuff ...
						*         callback(null, 'two');
						*     }
						* ],
						* // optional callback
						* function(err, results) {
						*     // results is now equal to ['one', 'two']
						* });
						*
						* async.series({
						*     one: function(callback) {
						*         setTimeout(function() {
						*             callback(null, 1);
						*         }, 200);
						*     },
						*     two: function(callback){
						*         setTimeout(function() {
						*             callback(null, 2);
						*         }, 100);
						*     }
						* }, function(err, results) {
						*     // results is now equal to: {one: 1, two: 2}
						* });
						*/
						function series(tasks, callback) {
							_parallel(eachOfSeries, tasks, callback);
						}
						/**
						* Returns `true` if at least one element in the `coll` satisfies an async test.
						* If any iteratee call returns `true`, the main `callback` is immediately
						* called.
						*
						* @name some
						* @static
						* @memberOf module:Collections
						* @method
						* @alias any
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async truth test to apply to each item
						* in the collections in parallel.
						* The iteratee should complete with a boolean `result` value.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called as soon as any
						* iteratee returns `true`, or after all the iteratee functions have finished.
						* Result will be either `true` or `false` depending on the values of the async
						* tests. Invoked with (err, result).
						* @example
						*
						* async.some(['file1','file2','file3'], function(filePath, callback) {
						*     fs.access(filePath, function(err) {
						*         callback(null, !err)
						*     });
						* }, function(err, result) {
						*     // if result is true then at least one of the files exists
						* });
						*/
						var some = doParallel(_createTester(Boolean, identity));
						/**
						* The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
						*
						* @name someLimit
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.some]{@link module:Collections.some}
						* @alias anyLimit
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - An async truth test to apply to each item
						* in the collections in parallel.
						* The iteratee should complete with a boolean `result` value.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called as soon as any
						* iteratee returns `true`, or after all the iteratee functions have finished.
						* Result will be either `true` or `false` depending on the values of the async
						* tests. Invoked with (err, result).
						*/
						var someLimit = doParallelLimit(_createTester(Boolean, identity));
						/**
						* The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
						*
						* @name someSeries
						* @static
						* @memberOf module:Collections
						* @method
						* @see [async.some]{@link module:Collections.some}
						* @alias anySeries
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async truth test to apply to each item
						* in the collections in series.
						* The iteratee should complete with a boolean `result` value.
						* Invoked with (item, callback).
						* @param {Function} [callback] - A callback which is called as soon as any
						* iteratee returns `true`, or after all the iteratee functions have finished.
						* Result will be either `true` or `false` depending on the values of the async
						* tests. Invoked with (err, result).
						*/
						var someSeries = doLimit(someLimit, 1);
						/**
						* Sorts a list by the results of running each `coll` value through an async
						* `iteratee`.
						*
						* @name sortBy
						* @static
						* @memberOf module:Collections
						* @method
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {AsyncFunction} iteratee - An async function to apply to each item in
						* `coll`.
						* The iteratee should complete with a value to use as the sort criteria as
						* its `result`.
						* Invoked with (item, callback).
						* @param {Function} callback - A callback which is called after all the
						* `iteratee` functions have finished, or an error occurs. Results is the items
						* from the original `coll` sorted by the values returned by the `iteratee`
						* calls. Invoked with (err, results).
						* @example
						*
						* async.sortBy(['file1','file2','file3'], function(file, callback) {
						*     fs.stat(file, function(err, stats) {
						*         callback(err, stats.mtime);
						*     });
						* }, function(err, results) {
						*     // results is now the original array of files sorted by
						*     // modified date
						* });
						*
						* // By modifying the callback parameter the
						* // sorting order can be influenced:
						*
						* // ascending order
						* async.sortBy([1,9,3,5], function(x, callback) {
						*     callback(null, x);
						* }, function(err,result) {
						*     // result callback
						* });
						*
						* // descending order
						* async.sortBy([1,9,3,5], function(x, callback) {
						*     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
						* }, function(err,result) {
						*     // result callback
						* });
						*/
						function sortBy(coll, iteratee, callback) {
							var _iteratee = wrapAsync(iteratee);
							map(coll, function(x, callback) {
								_iteratee(x, function(err, criteria) {
									if (err) return callback(err);
									callback(null, {
										value: x,
										criteria
									});
								});
							}, function(err, results) {
								if (err) return callback(err);
								callback(null, arrayMap(results.sort(comparator), baseProperty("value")));
							});
							function comparator(left, right) {
								var a = left.criteria, b = right.criteria;
								return a < b ? -1 : a > b ? 1 : 0;
							}
						}
						/**
						* Sets a time limit on an asynchronous function. If the function does not call
						* its callback within the specified milliseconds, it will be called with a
						* timeout error. The code property for the error object will be `'ETIMEDOUT'`.
						*
						* @name timeout
						* @static
						* @memberOf module:Utils
						* @method
						* @category Util
						* @param {AsyncFunction} asyncFn - The async function to limit in time.
						* @param {number} milliseconds - The specified time limit.
						* @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
						* to timeout Error for more information..
						* @returns {AsyncFunction} Returns a wrapped function that can be used with any
						* of the control flow functions.
						* Invoke this function with the same parameters as you would `asyncFunc`.
						* @example
						*
						* function myFunction(foo, callback) {
						*     doAsyncTask(foo, function(err, data) {
						*         // handle errors
						*         if (err) return callback(err);
						*
						*         // do some stuff ...
						*
						*         // return processed data
						*         return callback(null, data);
						*     });
						* }
						*
						* var wrapped = async.timeout(myFunction, 1000);
						*
						* // call `wrapped` as you would `myFunction`
						* wrapped({ bar: 'bar' }, function(err, data) {
						*     // if `myFunction` takes < 1000 ms to execute, `err`
						*     // and `data` will have their expected values
						*
						*     // else `err` will be an Error with the code 'ETIMEDOUT'
						* });
						*/
						function timeout(asyncFn, milliseconds, info) {
							var fn = wrapAsync(asyncFn);
							return initialParams(function(args, callback) {
								var timedOut = false;
								var timer;
								function timeoutCallback() {
									var name = asyncFn.name || "anonymous";
									var error = /* @__PURE__ */ new Error("Callback function \"" + name + "\" timed out.");
									error.code = "ETIMEDOUT";
									if (info) error.info = info;
									timedOut = true;
									callback(error);
								}
								args.push(function() {
									if (!timedOut) {
										callback.apply(null, arguments);
										clearTimeout(timer);
									}
								});
								timer = setTimeout(timeoutCallback, milliseconds);
								fn.apply(null, args);
							});
						}
						var nativeCeil = Math.ceil;
						var nativeMax = Math.max;
						/**
						* The base implementation of `_.range` and `_.rangeRight` which doesn't
						* coerce arguments.
						*
						* @private
						* @param {number} start The start of the range.
						* @param {number} end The end of the range.
						* @param {number} step The value to increment or decrement by.
						* @param {boolean} [fromRight] Specify iterating from right to left.
						* @returns {Array} Returns the range of numbers.
						*/
						function baseRange(start, end, step, fromRight) {
							var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
							while (length--) {
								result[fromRight ? length : ++index] = start;
								start += step;
							}
							return result;
						}
						/**
						* The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
						* time.
						*
						* @name timesLimit
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.times]{@link module:ControlFlow.times}
						* @category Control Flow
						* @param {number} count - The number of times to run the function.
						* @param {number} limit - The maximum number of async operations at a time.
						* @param {AsyncFunction} iteratee - The async function to call `n` times.
						* Invoked with the iteration index and a callback: (n, next).
						* @param {Function} callback - see [async.map]{@link module:Collections.map}.
						*/
						function timeLimit(count, limit, iteratee, callback) {
							var _iteratee = wrapAsync(iteratee);
							mapLimit(baseRange(0, count, 1), limit, _iteratee, callback);
						}
						/**
						* Calls the `iteratee` function `n` times, and accumulates results in the same
						* manner you would use with [map]{@link module:Collections.map}.
						*
						* @name times
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.map]{@link module:Collections.map}
						* @category Control Flow
						* @param {number} n - The number of times to run the function.
						* @param {AsyncFunction} iteratee - The async function to call `n` times.
						* Invoked with the iteration index and a callback: (n, next).
						* @param {Function} callback - see {@link module:Collections.map}.
						* @example
						*
						* // Pretend this is some complicated async factory
						* var createUser = function(id, callback) {
						*     callback(null, {
						*         id: 'user' + id
						*     });
						* };
						*
						* // generate 5 users
						* async.times(5, function(n, next) {
						*     createUser(n, function(err, user) {
						*         next(err, user);
						*     });
						* }, function(err, users) {
						*     // we should now have 5 users
						* });
						*/
						var times = doLimit(timeLimit, Infinity);
						/**
						* The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
						*
						* @name timesSeries
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.times]{@link module:ControlFlow.times}
						* @category Control Flow
						* @param {number} n - The number of times to run the function.
						* @param {AsyncFunction} iteratee - The async function to call `n` times.
						* Invoked with the iteration index and a callback: (n, next).
						* @param {Function} callback - see {@link module:Collections.map}.
						*/
						var timesSeries = doLimit(timeLimit, 1);
						/**
						* A relative of `reduce`.  Takes an Object or Array, and iterates over each
						* element in series, each step potentially mutating an `accumulator` value.
						* The type of the accumulator defaults to the type of collection passed in.
						*
						* @name transform
						* @static
						* @memberOf module:Collections
						* @method
						* @category Collection
						* @param {Array|Iterable|Object} coll - A collection to iterate over.
						* @param {*} [accumulator] - The initial state of the transform.  If omitted,
						* it will default to an empty Object or Array, depending on the type of `coll`
						* @param {AsyncFunction} iteratee - A function applied to each item in the
						* collection that potentially modifies the accumulator.
						* Invoked with (accumulator, item, key, callback).
						* @param {Function} [callback] - A callback which is called after all the
						* `iteratee` functions have finished. Result is the transformed accumulator.
						* Invoked with (err, result).
						* @example
						*
						* async.transform([1,2,3], function(acc, item, index, callback) {
						*     // pointless async:
						*     process.nextTick(function() {
						*         acc.push(item * 2)
						*         callback(null)
						*     });
						* }, function(err, result) {
						*     // result is now equal to [2, 4, 6]
						* });
						*
						* @example
						*
						* async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
						*     setImmediate(function () {
						*         obj[key] = val * 2;
						*         callback();
						*     })
						* }, function (err, result) {
						*     // result is equal to {a: 2, b: 4, c: 6}
						* })
						*/
						function transform(coll, accumulator, iteratee, callback) {
							if (arguments.length <= 3) {
								callback = iteratee;
								iteratee = accumulator;
								accumulator = isArray(coll) ? [] : {};
							}
							callback = once(callback || noop);
							var _iteratee = wrapAsync(iteratee);
							eachOf(coll, function(v, k, cb) {
								_iteratee(accumulator, v, k, cb);
							}, function(err) {
								callback(err, accumulator);
							});
						}
						/**
						* It runs each task in series but stops whenever any of the functions were
						* successful. If one of the tasks were successful, the `callback` will be
						* passed the result of the successful task. If all tasks fail, the callback
						* will be passed the error and result (if any) of the final attempt.
						*
						* @name tryEach
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {Array|Iterable|Object} tasks - A collection containing functions to
						* run, each function is passed a `callback(err, result)` it must call on
						* completion with an error `err` (which can be `null`) and an optional `result`
						* value.
						* @param {Function} [callback] - An optional callback which is called when one
						* of the tasks has succeeded, or all have failed. It receives the `err` and
						* `result` arguments of the last attempt at completing the `task`. Invoked with
						* (err, results).
						* @example
						* async.tryEach([
						*     function getDataFromFirstWebsite(callback) {
						*         // Try getting the data from the first website
						*         callback(err, data);
						*     },
						*     function getDataFromSecondWebsite(callback) {
						*         // First website failed,
						*         // Try getting the data from the backup website
						*         callback(err, data);
						*     }
						* ],
						* // optional callback
						* function(err, results) {
						*     Now do something with the data.
						* });
						*
						*/
						function tryEach(tasks, callback) {
							var error = null;
							var result;
							callback = callback || noop;
							eachSeries(tasks, function(task, callback) {
								wrapAsync(task)(function(err, res) {
									if (arguments.length > 2) result = slice(arguments, 1);
									else result = res;
									error = err;
									callback(!err);
								});
							}, function() {
								callback(error, result);
							});
						}
						/**
						* Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
						* unmemoized form. Handy for testing.
						*
						* @name unmemoize
						* @static
						* @memberOf module:Utils
						* @method
						* @see [async.memoize]{@link module:Utils.memoize}
						* @category Util
						* @param {AsyncFunction} fn - the memoized function
						* @returns {AsyncFunction} a function that calls the original unmemoized function
						*/
						function unmemoize(fn) {
							return function() {
								return (fn.unmemoized || fn).apply(null, arguments);
							};
						}
						/**
						* Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
						* stopped, or an error occurs.
						*
						* @name whilst
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {Function} test - synchronous truth test to perform before each
						* execution of `iteratee`. Invoked with ().
						* @param {AsyncFunction} iteratee - An async function which is called each time
						* `test` passes. Invoked with (callback).
						* @param {Function} [callback] - A callback which is called after the test
						* function has failed and repeated execution of `iteratee` has stopped. `callback`
						* will be passed an error and any arguments passed to the final `iteratee`'s
						* callback. Invoked with (err, [results]);
						* @returns undefined
						* @example
						*
						* var count = 0;
						* async.whilst(
						*     function() { return count < 5; },
						*     function(callback) {
						*         count++;
						*         setTimeout(function() {
						*             callback(null, count);
						*         }, 1000);
						*     },
						*     function (err, n) {
						*         // 5 seconds have passed, n = 5
						*     }
						* );
						*/
						function whilst(test, iteratee, callback) {
							callback = onlyOnce(callback || noop);
							var _iteratee = wrapAsync(iteratee);
							if (!test()) return callback(null);
							var next = function(err) {
								if (err) return callback(err);
								if (test()) return _iteratee(next);
								var args = slice(arguments, 1);
								callback.apply(null, [null].concat(args));
							};
							_iteratee(next);
						}
						/**
						* Repeatedly call `iteratee` until `test` returns `true`. Calls `callback` when
						* stopped, or an error occurs. `callback` will be passed an error and any
						* arguments passed to the final `iteratee`'s callback.
						*
						* The inverse of [whilst]{@link module:ControlFlow.whilst}.
						*
						* @name until
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @see [async.whilst]{@link module:ControlFlow.whilst}
						* @category Control Flow
						* @param {Function} test - synchronous truth test to perform before each
						* execution of `iteratee`. Invoked with ().
						* @param {AsyncFunction} iteratee - An async function which is called each time
						* `test` fails. Invoked with (callback).
						* @param {Function} [callback] - A callback which is called after the test
						* function has passed and repeated execution of `iteratee` has stopped. `callback`
						* will be passed an error and any arguments passed to the final `iteratee`'s
						* callback. Invoked with (err, [results]);
						*/
						function until(test, iteratee, callback) {
							whilst(function() {
								return !test.apply(this, arguments);
							}, iteratee, callback);
						}
						/**
						* Runs the `tasks` array of functions in series, each passing their results to
						* the next in the array. However, if any of the `tasks` pass an error to their
						* own callback, the next function is not executed, and the main `callback` is
						* immediately called with the error.
						*
						* @name waterfall
						* @static
						* @memberOf module:ControlFlow
						* @method
						* @category Control Flow
						* @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
						* to run.
						* Each function should complete with any number of `result` values.
						* The `result` values will be passed as arguments, in order, to the next task.
						* @param {Function} [callback] - An optional callback to run once all the
						* functions have completed. This will be passed the results of the last task's
						* callback. Invoked with (err, [results]).
						* @returns undefined
						* @example
						*
						* async.waterfall([
						*     function(callback) {
						*         callback(null, 'one', 'two');
						*     },
						*     function(arg1, arg2, callback) {
						*         // arg1 now equals 'one' and arg2 now equals 'two'
						*         callback(null, 'three');
						*     },
						*     function(arg1, callback) {
						*         // arg1 now equals 'three'
						*         callback(null, 'done');
						*     }
						* ], function (err, result) {
						*     // result now equals 'done'
						* });
						*
						* // Or, with named functions:
						* async.waterfall([
						*     myFirstFunction,
						*     mySecondFunction,
						*     myLastFunction,
						* ], function (err, result) {
						*     // result now equals 'done'
						* });
						* function myFirstFunction(callback) {
						*     callback(null, 'one', 'two');
						* }
						* function mySecondFunction(arg1, arg2, callback) {
						*     // arg1 now equals 'one' and arg2 now equals 'two'
						*     callback(null, 'three');
						* }
						* function myLastFunction(arg1, callback) {
						*     // arg1 now equals 'three'
						*     callback(null, 'done');
						* }
						*/
						var waterfall = function(tasks, callback) {
							callback = once(callback || noop);
							if (!isArray(tasks)) return callback(/* @__PURE__ */ new Error("First argument to waterfall must be an array of functions"));
							if (!tasks.length) return callback();
							var taskIndex = 0;
							function nextTask(args) {
								var task = wrapAsync(tasks[taskIndex++]);
								args.push(onlyOnce(next));
								task.apply(null, args);
							}
							function next(err) {
								if (err || taskIndex === tasks.length) return callback.apply(null, arguments);
								nextTask(slice(arguments, 1));
							}
							nextTask([]);
						};
						exports$2["default"] = {
							apply,
							applyEach,
							applyEachSeries,
							asyncify,
							auto,
							autoInject,
							cargo,
							compose,
							concat,
							concatLimit,
							concatSeries,
							constant,
							detect,
							detectLimit,
							detectSeries,
							dir,
							doDuring,
							doUntil,
							doWhilst,
							during,
							each: eachLimit,
							eachLimit: eachLimit$1,
							eachOf,
							eachOfLimit,
							eachOfSeries,
							eachSeries,
							ensureAsync,
							every,
							everyLimit,
							everySeries,
							filter,
							filterLimit,
							filterSeries,
							forever,
							groupBy,
							groupByLimit,
							groupBySeries,
							log,
							map,
							mapLimit,
							mapSeries,
							mapValues,
							mapValuesLimit,
							mapValuesSeries,
							memoize,
							nextTick,
							parallel: parallelLimit,
							parallelLimit: parallelLimit$1,
							priorityQueue,
							queue: queue$1,
							race,
							reduce,
							reduceRight,
							reflect,
							reflectAll,
							reject,
							rejectLimit,
							rejectSeries,
							retry,
							retryable,
							seq,
							series,
							setImmediate: setImmediate$1,
							some,
							someLimit,
							someSeries,
							sortBy,
							timeout,
							times,
							timesLimit: timeLimit,
							timesSeries,
							transform,
							tryEach,
							unmemoize,
							until,
							waterfall,
							whilst,
							all: every,
							allLimit: everyLimit,
							allSeries: everySeries,
							any: some,
							anyLimit: someLimit,
							anySeries: someSeries,
							find: detect,
							findLimit: detectLimit,
							findSeries: detectSeries,
							forEach: eachLimit,
							forEachSeries: eachSeries,
							forEachLimit: eachLimit$1,
							forEachOf: eachOf,
							forEachOfSeries: eachOfSeries,
							forEachOfLimit: eachOfLimit,
							inject: reduce,
							foldl: reduce,
							foldr: reduceRight,
							select: filter,
							selectLimit: filterLimit,
							selectSeries: filterSeries,
							wrapSync: asyncify
						};
						exports$2.apply = apply;
						exports$2.applyEach = applyEach;
						exports$2.applyEachSeries = applyEachSeries;
						exports$2.asyncify = asyncify;
						exports$2.auto = auto;
						exports$2.autoInject = autoInject;
						exports$2.cargo = cargo;
						exports$2.compose = compose;
						exports$2.concat = concat;
						exports$2.concatLimit = concatLimit;
						exports$2.concatSeries = concatSeries;
						exports$2.constant = constant;
						exports$2.detect = detect;
						exports$2.detectLimit = detectLimit;
						exports$2.detectSeries = detectSeries;
						exports$2.dir = dir;
						exports$2.doDuring = doDuring;
						exports$2.doUntil = doUntil;
						exports$2.doWhilst = doWhilst;
						exports$2.during = during;
						exports$2.each = eachLimit;
						exports$2.eachLimit = eachLimit$1;
						exports$2.eachOf = eachOf;
						exports$2.eachOfLimit = eachOfLimit;
						exports$2.eachOfSeries = eachOfSeries;
						exports$2.eachSeries = eachSeries;
						exports$2.ensureAsync = ensureAsync;
						exports$2.every = every;
						exports$2.everyLimit = everyLimit;
						exports$2.everySeries = everySeries;
						exports$2.filter = filter;
						exports$2.filterLimit = filterLimit;
						exports$2.filterSeries = filterSeries;
						exports$2.forever = forever;
						exports$2.groupBy = groupBy;
						exports$2.groupByLimit = groupByLimit;
						exports$2.groupBySeries = groupBySeries;
						exports$2.log = log;
						exports$2.map = map;
						exports$2.mapLimit = mapLimit;
						exports$2.mapSeries = mapSeries;
						exports$2.mapValues = mapValues;
						exports$2.mapValuesLimit = mapValuesLimit;
						exports$2.mapValuesSeries = mapValuesSeries;
						exports$2.memoize = memoize;
						exports$2.nextTick = nextTick;
						exports$2.parallel = parallelLimit;
						exports$2.parallelLimit = parallelLimit$1;
						exports$2.priorityQueue = priorityQueue;
						exports$2.queue = queue$1;
						exports$2.race = race;
						exports$2.reduce = reduce;
						exports$2.reduceRight = reduceRight;
						exports$2.reflect = reflect;
						exports$2.reflectAll = reflectAll;
						exports$2.reject = reject;
						exports$2.rejectLimit = rejectLimit;
						exports$2.rejectSeries = rejectSeries;
						exports$2.retry = retry;
						exports$2.retryable = retryable;
						exports$2.seq = seq;
						exports$2.series = series;
						exports$2.setImmediate = setImmediate$1;
						exports$2.some = some;
						exports$2.someLimit = someLimit;
						exports$2.someSeries = someSeries;
						exports$2.sortBy = sortBy;
						exports$2.timeout = timeout;
						exports$2.times = times;
						exports$2.timesLimit = timeLimit;
						exports$2.timesSeries = timesSeries;
						exports$2.transform = transform;
						exports$2.tryEach = tryEach;
						exports$2.unmemoize = unmemoize;
						exports$2.until = until;
						exports$2.waterfall = waterfall;
						exports$2.whilst = whilst;
						exports$2.all = every;
						exports$2.allLimit = everyLimit;
						exports$2.allSeries = everySeries;
						exports$2.any = some;
						exports$2.anyLimit = someLimit;
						exports$2.anySeries = someSeries;
						exports$2.find = detect;
						exports$2.findLimit = detectLimit;
						exports$2.findSeries = detectSeries;
						exports$2.forEach = eachLimit;
						exports$2.forEachSeries = eachSeries;
						exports$2.forEachLimit = eachLimit$1;
						exports$2.forEachOf = eachOf;
						exports$2.forEachOfSeries = eachOfSeries;
						exports$2.forEachOfLimit = eachOfLimit;
						exports$2.inject = reduce;
						exports$2.foldl = reduce;
						exports$2.foldr = reduceRight;
						exports$2.select = filter;
						exports$2.selectLimit = filterLimit;
						exports$2.selectSeries = filterSeries;
						exports$2.wrapSync = asyncify;
						Object.defineProperty(exports$2, "__esModule", { value: true });
					}));
				}).call(this, require("_process"), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
			}, { "_process": 4 }],
			2: [function(require, module$2, exports$3) {
				(function() {
					"use strict";
					var TERM_CHAR = "\0", TERM_CODE = 0, ROOT_ID = 0, NOT_FOUND = -1, BASE_SIGNED = true, CHECK_SIGNED = true, BASE_BYTES = 4, CHECK_BYTES = 4, MEMORY_EXPAND_RATIO = 2;
					var newBC = function(initial_size) {
						if (initial_size == null) initial_size = 1024;
						var initBase = function(_base, start, end) {
							for (var i = start; i < end; i++) _base[i] = -i + 1;
							if (0 < check.array[check.array.length - 1]) {
								var last_used_id = check.array.length - 2;
								while (0 < check.array[last_used_id]) last_used_id--;
								_base[start] = -last_used_id;
							}
						};
						var initCheck = function(_check, start, end) {
							for (var i = start; i < end; i++) _check[i] = -i - 1;
						};
						var realloc = function(min_size) {
							var new_size = min_size * MEMORY_EXPAND_RATIO;
							var base_new_array = newArrayBuffer(base.signed, base.bytes, new_size);
							initBase(base_new_array, base.array.length, new_size);
							base_new_array.set(base.array);
							base.array = null;
							base.array = base_new_array;
							var check_new_array = newArrayBuffer(check.signed, check.bytes, new_size);
							initCheck(check_new_array, check.array.length, new_size);
							check_new_array.set(check.array);
							check.array = null;
							check.array = check_new_array;
						};
						var first_unused_node = ROOT_ID + 1;
						var base = {
							signed: BASE_SIGNED,
							bytes: BASE_BYTES,
							array: newArrayBuffer(BASE_SIGNED, BASE_BYTES, initial_size)
						};
						var check = {
							signed: CHECK_SIGNED,
							bytes: CHECK_BYTES,
							array: newArrayBuffer(CHECK_SIGNED, CHECK_BYTES, initial_size)
						};
						base.array[ROOT_ID] = 1;
						check.array[ROOT_ID] = ROOT_ID;
						initBase(base.array, ROOT_ID + 1, base.array.length);
						initCheck(check.array, ROOT_ID + 1, check.array.length);
						return {
							getBaseBuffer: function() {
								return base.array;
							},
							getCheckBuffer: function() {
								return check.array;
							},
							loadBaseBuffer: function(base_buffer) {
								base.array = base_buffer;
								return this;
							},
							loadCheckBuffer: function(check_buffer) {
								check.array = check_buffer;
								return this;
							},
							size: function() {
								return Math.max(base.array.length, check.array.length);
							},
							getBase: function(index) {
								if (base.array.length - 1 < index) return -index + 1;
								return base.array[index];
							},
							getCheck: function(index) {
								if (check.array.length - 1 < index) return -index - 1;
								return check.array[index];
							},
							setBase: function(index, base_value) {
								if (base.array.length - 1 < index) realloc(index);
								base.array[index] = base_value;
							},
							setCheck: function(index, check_value) {
								if (check.array.length - 1 < index) realloc(index);
								check.array[index] = check_value;
							},
							setFirstUnusedNode: function(index) {
								first_unused_node = index;
							},
							getFirstUnusedNode: function() {
								return first_unused_node;
							},
							shrink: function() {
								var last_index = this.size() - 1;
								while (true) {
									if (0 <= check.array[last_index]) break;
									last_index--;
								}
								base.array = base.array.subarray(0, last_index + 2);
								check.array = check.array.subarray(0, last_index + 2);
							},
							calc: function() {
								var unused_count = 0;
								var size = check.array.length;
								for (var i = 0; i < size; i++) if (check.array[i] < 0) unused_count++;
								return {
									all: size,
									unused: unused_count,
									efficiency: (size - unused_count) / size
								};
							},
							dump: function() {
								var dump_base = "";
								var dump_check = "";
								var i;
								for (i = 0; i < base.array.length; i++) dump_base = dump_base + " " + this.getBase(i);
								for (i = 0; i < check.array.length; i++) dump_check = dump_check + " " + this.getCheck(i);
								console.log("base:" + dump_base);
								console.log("chck:" + dump_check);
								return "base:" + dump_base + " chck:" + dump_check;
							}
						};
					};
					/**
					* Factory method of double array
					*/
					function DoubleArrayBuilder(initial_size) {
						this.bc = newBC(initial_size);
						this.keys = [];
					}
					/**
					* Append a key to initialize set
					* (This method should be called by dictionary ordered key)
					*
					* @param {String} key
					* @param {Number} value Integer value from 0 to max signed integer number - 1
					*/
					DoubleArrayBuilder.prototype.append = function(key, record) {
						this.keys.push({
							k: key,
							v: record
						});
						return this;
					};
					/**
					* Build double array for given keys
					*
					* @param {Array} keys Array of keys. A key is a Object which has properties 'k', 'v'.
					* 'k' is a key string, 'v' is a record assigned to that key.
					* @return {DoubleArray} Compiled double array
					*/
					DoubleArrayBuilder.prototype.build = function(keys, sorted) {
						if (keys == null) keys = this.keys;
						if (keys == null) return new DoubleArray(this.bc);
						if (sorted == null) sorted = false;
						var buff_keys = keys.map(function(k) {
							return {
								k: stringToUtf8Bytes(k.k + TERM_CHAR),
								v: k.v
							};
						});
						if (sorted) this.keys = buff_keys;
						else this.keys = buff_keys.sort(function(k1, k2) {
							var b1 = k1.k;
							var b2 = k2.k;
							var min_length = Math.min(b1.length, b2.length);
							for (var pos = 0; pos < min_length; pos++) {
								if (b1[pos] === b2[pos]) continue;
								return b1[pos] - b2[pos];
							}
							return b1.length - b2.length;
						});
						buff_keys = null;
						this._build(ROOT_ID, 0, 0, this.keys.length);
						return new DoubleArray(this.bc);
					};
					/**
					* Append nodes to BASE and CHECK array recursively
					*/
					DoubleArrayBuilder.prototype._build = function(parent_index, position, start, length) {
						var children_info = this.getChildrenInfo(position, start, length);
						var _base = this.findAllocatableBase(children_info);
						this.setBC(parent_index, children_info, _base);
						for (var i = 0; i < children_info.length; i = i + 3) {
							var child_code = children_info[i];
							if (child_code === TERM_CODE) continue;
							var child_start = children_info[i + 1];
							var child_len = children_info[i + 2];
							var child_index = _base + child_code;
							this._build(child_index, position + 1, child_start, child_len);
						}
					};
					DoubleArrayBuilder.prototype.getChildrenInfo = function(position, start, length) {
						var current_char = this.keys[start].k[position];
						var i = 0;
						var children_info = new Int32Array(length * 3);
						children_info[i++] = current_char;
						children_info[i++] = start;
						var next_pos = start;
						var start_pos = start;
						for (; next_pos < start + length; next_pos++) {
							var next_char = this.keys[next_pos].k[position];
							if (current_char !== next_char) {
								children_info[i++] = next_pos - start_pos;
								children_info[i++] = next_char;
								children_info[i++] = next_pos;
								current_char = next_char;
								start_pos = next_pos;
							}
						}
						children_info[i++] = next_pos - start_pos;
						children_info = children_info.subarray(0, i);
						return children_info;
					};
					DoubleArrayBuilder.prototype.setBC = function(parent_id, children_info, _base) {
						var bc = this.bc;
						bc.setBase(parent_id, _base);
						var i;
						for (i = 0; i < children_info.length; i = i + 3) {
							var code = children_info[i];
							var child_id = _base + code;
							var prev_unused_id = -bc.getBase(child_id);
							var next_unused_id = -bc.getCheck(child_id);
							if (child_id !== bc.getFirstUnusedNode()) bc.setCheck(prev_unused_id, -next_unused_id);
							else bc.setFirstUnusedNode(next_unused_id);
							bc.setBase(next_unused_id, -prev_unused_id);
							var check = parent_id;
							bc.setCheck(child_id, check);
							if (code === TERM_CODE) {
								var start_pos = children_info[i + 1];
								var value = this.keys[start_pos].v;
								if (value == null) value = 0;
								var base = -value - 1;
								bc.setBase(child_id, base);
							}
						}
					};
					/**
					* Find BASE value that all children are allocatable in double array's region
					*/
					DoubleArrayBuilder.prototype.findAllocatableBase = function(children_info) {
						var bc = this.bc;
						var _base;
						var curr = bc.getFirstUnusedNode();
						while (true) {
							_base = curr - children_info[0];
							if (_base < 0) {
								curr = -bc.getCheck(curr);
								continue;
							}
							var empty_area_found = true;
							for (var i = 0; i < children_info.length; i = i + 3) {
								var code = children_info[i];
								var candidate_id = _base + code;
								if (!this.isUnusedNode(candidate_id)) {
									curr = -bc.getCheck(curr);
									empty_area_found = false;
									break;
								}
							}
							if (empty_area_found) return _base;
						}
					};
					/**
					* Check this double array index is unused or not
					*/
					DoubleArrayBuilder.prototype.isUnusedNode = function(index) {
						var check = this.bc.getCheck(index);
						if (index === ROOT_ID) return false;
						if (check < 0) return true;
						return false;
					};
					/**
					* Factory method of double array
					*/
					function DoubleArray(bc) {
						this.bc = bc;
						this.bc.shrink();
					}
					/**
					* Look up a given key in this trie
					*
					* @param {String} key
					* @return {Boolean} True if this trie contains a given key
					*/
					DoubleArray.prototype.contain = function(key) {
						var bc = this.bc;
						key += TERM_CHAR;
						var buffer = stringToUtf8Bytes(key);
						var parent = ROOT_ID;
						var child = NOT_FOUND;
						for (var i = 0; i < buffer.length; i++) {
							var code = buffer[i];
							child = this.traverse(parent, code);
							if (child === NOT_FOUND) return false;
							if (bc.getBase(child) <= 0) return true;
							else {
								parent = child;
								continue;
							}
						}
						return false;
					};
					/**
					* Look up a given key in this trie
					*
					* @param {String} key
					* @return {Number} Record value assgned to this key, -1 if this key does not contain
					*/
					DoubleArray.prototype.lookup = function(key) {
						key += TERM_CHAR;
						var buffer = stringToUtf8Bytes(key);
						var parent = ROOT_ID;
						var child = NOT_FOUND;
						for (var i = 0; i < buffer.length; i++) {
							var code = buffer[i];
							child = this.traverse(parent, code);
							if (child === NOT_FOUND) return NOT_FOUND;
							parent = child;
						}
						var base = this.bc.getBase(child);
						if (base <= 0) return -base - 1;
						else return NOT_FOUND;
					};
					/**
					* Common prefix search
					*
					* @param {String} key
					* @return {Array} Each result object has 'k' and 'v' (key and record,
					* respectively) properties assigned to matched string
					*/
					DoubleArray.prototype.commonPrefixSearch = function(key) {
						var buffer = stringToUtf8Bytes(key);
						var parent = ROOT_ID;
						var child = NOT_FOUND;
						var result = [];
						for (var i = 0; i < buffer.length; i++) {
							var code = buffer[i];
							child = this.traverse(parent, code);
							if (child !== NOT_FOUND) {
								parent = child;
								var grand_child = this.traverse(child, TERM_CODE);
								if (grand_child !== NOT_FOUND) {
									var base = this.bc.getBase(grand_child);
									var r = {};
									if (base <= 0) r.v = -base - 1;
									r.k = utf8BytesToString(arrayCopy(buffer, 0, i + 1));
									result.push(r);
								}
								continue;
							} else break;
						}
						return result;
					};
					DoubleArray.prototype.traverse = function(parent, code) {
						var child = this.bc.getBase(parent) + code;
						if (this.bc.getCheck(child) === parent) return child;
						else return NOT_FOUND;
					};
					DoubleArray.prototype.size = function() {
						return this.bc.size();
					};
					DoubleArray.prototype.calc = function() {
						return this.bc.calc();
					};
					DoubleArray.prototype.dump = function() {
						return this.bc.dump();
					};
					var newArrayBuffer = function(signed, bytes, size) {
						if (signed) switch (bytes) {
							case 1: return new Int8Array(size);
							case 2: return new Int16Array(size);
							case 4: return new Int32Array(size);
							default: throw new RangeError("Invalid newArray parameter element_bytes:" + bytes);
						}
						else switch (bytes) {
							case 1: return new Uint8Array(size);
							case 2: return new Uint16Array(size);
							case 4: return new Uint32Array(size);
							default: throw new RangeError("Invalid newArray parameter element_bytes:" + bytes);
						}
					};
					var arrayCopy = function(src, src_offset, length) {
						var buffer = new ArrayBuffer(length);
						var dstU8 = new Uint8Array(buffer, 0, length);
						var srcU8 = src.subarray(src_offset, length);
						dstU8.set(srcU8);
						return dstU8;
					};
					/**
					* Convert String (UTF-16) to UTF-8 ArrayBuffer
					*
					* @param {String} str UTF-16 string to convert
					* @return {Uint8Array} Byte sequence encoded by UTF-8
					*/
					var stringToUtf8Bytes = function(str) {
						var bytes = new Uint8Array(/* @__PURE__ */ new ArrayBuffer(str.length * 4));
						var i = 0, j = 0;
						while (i < str.length) {
							var unicode_code;
							var utf16_code = str.charCodeAt(i++);
							if (utf16_code >= 55296 && utf16_code <= 56319) {
								var upper = utf16_code;
								var lower = str.charCodeAt(i++);
								if (lower >= 56320 && lower <= 57343) unicode_code = (upper - 55296) * 1024 + 65536 + (lower - 56320);
								else return null;
							} else unicode_code = utf16_code;
							if (unicode_code < 128) bytes[j++] = unicode_code;
							else if (unicode_code < 2048) {
								bytes[j++] = unicode_code >>> 6 | 192;
								bytes[j++] = unicode_code & 63 | 128;
							} else if (unicode_code < 65536) {
								bytes[j++] = unicode_code >>> 12 | 224;
								bytes[j++] = unicode_code >> 6 & 63 | 128;
								bytes[j++] = unicode_code & 63 | 128;
							} else if (unicode_code < 1 << 21) {
								bytes[j++] = unicode_code >>> 18 | 240;
								bytes[j++] = unicode_code >> 12 & 63 | 128;
								bytes[j++] = unicode_code >> 6 & 63 | 128;
								bytes[j++] = unicode_code & 63 | 128;
							}
						}
						return bytes.subarray(0, j);
					};
					/**
					* Convert UTF-8 ArrayBuffer to String (UTF-16)
					*
					* @param {Uint8Array} bytes UTF-8 byte sequence to convert
					* @return {String} String encoded by UTF-16
					*/
					var utf8BytesToString = function(bytes) {
						var str = "";
						var code, b1, b2, b3, b4, upper, lower;
						var i = 0;
						while (i < bytes.length) {
							b1 = bytes[i++];
							if (b1 < 128) code = b1;
							else if (b1 >> 5 === 6) {
								b2 = bytes[i++];
								code = (b1 & 31) << 6 | b2 & 63;
							} else if (b1 >> 4 === 14) {
								b2 = bytes[i++];
								b3 = bytes[i++];
								code = (b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63;
							} else {
								b2 = bytes[i++];
								b3 = bytes[i++];
								b4 = bytes[i++];
								code = (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63;
							}
							if (code < 65536) str += String.fromCharCode(code);
							else {
								code -= 65536;
								upper = 55296 | code >> 10;
								lower = 56320 | code & 1023;
								str += String.fromCharCode(upper, lower);
							}
						}
						return str;
					};
					var doublearray = {
						builder: function(initial_size) {
							return new DoubleArrayBuilder(initial_size);
						},
						load: function(base_buffer, check_buffer) {
							var bc = newBC(0);
							bc.loadBaseBuffer(base_buffer);
							bc.loadCheckBuffer(check_buffer);
							return new DoubleArray(bc);
						}
					};
					if ("undefined" === typeof module$2) window.doublearray = doublearray;
					else module$2.exports = doublearray;
				})();
			}, {}],
			3: [function(require, module$3, exports$4) {
				(function(process) {
					function normalizeArray(parts, allowAboveRoot) {
						var up = 0;
						for (var i = parts.length - 1; i >= 0; i--) {
							var last = parts[i];
							if (last === ".") parts.splice(i, 1);
							else if (last === "..") {
								parts.splice(i, 1);
								up++;
							} else if (up) {
								parts.splice(i, 1);
								up--;
							}
						}
						if (allowAboveRoot) for (; up--;) parts.unshift("..");
						return parts;
					}
					var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
					var splitPath = function(filename) {
						return splitPathRe.exec(filename).slice(1);
					};
					exports$4.resolve = function() {
						var resolvedPath = "", resolvedAbsolute = false;
						for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
							var path = i >= 0 ? arguments[i] : process.cwd();
							if (typeof path !== "string") throw new TypeError("Arguments to path.resolve must be strings");
							else if (!path) continue;
							resolvedPath = path + "/" + resolvedPath;
							resolvedAbsolute = path.charAt(0) === "/";
						}
						resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(p) {
							return !!p;
						}), !resolvedAbsolute).join("/");
						return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
					};
					exports$4.normalize = function(path) {
						var isAbsolute = exports$4.isAbsolute(path), trailingSlash = substr(path, -1) === "/";
						path = normalizeArray(filter(path.split("/"), function(p) {
							return !!p;
						}), !isAbsolute).join("/");
						if (!path && !isAbsolute) path = ".";
						if (path && trailingSlash) path += "/";
						return (isAbsolute ? "/" : "") + path;
					};
					exports$4.isAbsolute = function(path) {
						return path.charAt(0) === "/";
					};
					exports$4.join = function() {
						var paths = Array.prototype.slice.call(arguments, 0);
						return exports$4.normalize(filter(paths, function(p, index) {
							if (typeof p !== "string") throw new TypeError("Arguments to path.join must be strings");
							return p;
						}).join("/"));
					};
					exports$4.relative = function(from, to) {
						from = exports$4.resolve(from).substr(1);
						to = exports$4.resolve(to).substr(1);
						function trim(arr) {
							var start = 0;
							for (; start < arr.length; start++) if (arr[start] !== "") break;
							var end = arr.length - 1;
							for (; end >= 0; end--) if (arr[end] !== "") break;
							if (start > end) return [];
							return arr.slice(start, end - start + 1);
						}
						var fromParts = trim(from.split("/"));
						var toParts = trim(to.split("/"));
						var length = Math.min(fromParts.length, toParts.length);
						var samePartsLength = length;
						for (var i = 0; i < length; i++) if (fromParts[i] !== toParts[i]) {
							samePartsLength = i;
							break;
						}
						var outputParts = [];
						for (var i = samePartsLength; i < fromParts.length; i++) outputParts.push("..");
						outputParts = outputParts.concat(toParts.slice(samePartsLength));
						return outputParts.join("/");
					};
					exports$4.sep = "/";
					exports$4.delimiter = ":";
					exports$4.dirname = function(path) {
						var result = splitPath(path), root = result[0], dir = result[1];
						if (!root && !dir) return ".";
						if (dir) dir = dir.substr(0, dir.length - 1);
						return root + dir;
					};
					exports$4.basename = function(path, ext) {
						var f = splitPath(path)[2];
						if (ext && f.substr(-1 * ext.length) === ext) f = f.substr(0, f.length - ext.length);
						return f;
					};
					exports$4.extname = function(path) {
						return splitPath(path)[3];
					};
					function filter(xs, f) {
						if (xs.filter) return xs.filter(f);
						var res = [];
						for (var i = 0; i < xs.length; i++) if (f(xs[i], i, xs)) res.push(xs[i]);
						return res;
					}
					var substr = "ab".substr(-1) === "b" ? function(str, start, len) {
						return str.substr(start, len);
					} : function(str, start, len) {
						if (start < 0) start = str.length + start;
						return str.substr(start, len);
					};
				}).call(this, require("_process"));
			}, { "_process": 4 }],
			4: [function(require, module$4, exports$5) {
				var process = module$4.exports = {};
				var cachedSetTimeout;
				var cachedClearTimeout;
				function defaultSetTimout() {
					throw new Error("setTimeout has not been defined");
				}
				function defaultClearTimeout() {
					throw new Error("clearTimeout has not been defined");
				}
				(function() {
					try {
						if (typeof setTimeout === "function") cachedSetTimeout = setTimeout;
						else cachedSetTimeout = defaultSetTimout;
					} catch (e) {
						cachedSetTimeout = defaultSetTimout;
					}
					try {
						if (typeof clearTimeout === "function") cachedClearTimeout = clearTimeout;
						else cachedClearTimeout = defaultClearTimeout;
					} catch (e) {
						cachedClearTimeout = defaultClearTimeout;
					}
				})();
				function runTimeout(fun) {
					if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
					if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
						cachedSetTimeout = setTimeout;
						return setTimeout(fun, 0);
					}
					try {
						return cachedSetTimeout(fun, 0);
					} catch (e) {
						try {
							return cachedSetTimeout.call(null, fun, 0);
						} catch (e) {
							return cachedSetTimeout.call(this, fun, 0);
						}
					}
				}
				function runClearTimeout(marker) {
					if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
					if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
						cachedClearTimeout = clearTimeout;
						return clearTimeout(marker);
					}
					try {
						return cachedClearTimeout(marker);
					} catch (e) {
						try {
							return cachedClearTimeout.call(null, marker);
						} catch (e) {
							return cachedClearTimeout.call(this, marker);
						}
					}
				}
				var queue = [];
				var draining = false;
				var currentQueue;
				var queueIndex = -1;
				function cleanUpNextTick() {
					if (!draining || !currentQueue) return;
					draining = false;
					if (currentQueue.length) queue = currentQueue.concat(queue);
					else queueIndex = -1;
					if (queue.length) drainQueue();
				}
				function drainQueue() {
					if (draining) return;
					var timeout = runTimeout(cleanUpNextTick);
					draining = true;
					var len = queue.length;
					while (len) {
						currentQueue = queue;
						queue = [];
						while (++queueIndex < len) if (currentQueue) currentQueue[queueIndex].run();
						queueIndex = -1;
						len = queue.length;
					}
					currentQueue = null;
					draining = false;
					runClearTimeout(timeout);
				}
				process.nextTick = function(fun) {
					var args = new Array(arguments.length - 1);
					if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
					queue.push(new Item(fun, args));
					if (queue.length === 1 && !draining) runTimeout(drainQueue);
				};
				function Item(fun, array) {
					this.fun = fun;
					this.array = array;
				}
				Item.prototype.run = function() {
					this.fun.apply(null, this.array);
				};
				process.title = "browser";
				process.browser = true;
				process.env = {};
				process.argv = [];
				process.version = "";
				process.versions = {};
				function noop() {}
				process.on = noop;
				process.addListener = noop;
				process.once = noop;
				process.off = noop;
				process.removeListener = noop;
				process.removeAllListeners = noop;
				process.emit = noop;
				process.prependListener = noop;
				process.prependOnceListener = noop;
				process.listeners = function(name) {
					return [];
				};
				process.binding = function(name) {
					throw new Error("process.binding is not supported");
				};
				process.cwd = function() {
					return "/";
				};
				process.chdir = function(dir) {
					throw new Error("process.chdir is not supported");
				};
				process.umask = function() {
					return 0;
				};
			}, {}],
			5: [function(require, module$5, exports$6) {
				/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */ (function() {
					"use strict";
					function n(e) {
						throw e;
					}
					var p = void 0, aa = this;
					function t(e, b) {
						var d = e.split("."), c = aa;
						!(d[0] in c) && c.execScript && c.execScript("var " + d[0]);
						for (var a; d.length && (a = d.shift());) !d.length && b !== p ? c[a] = b : c = c[a] ? c[a] : c[a] = {};
					}
					var x = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Uint32Array && "undefined" !== typeof DataView;
					new (x ? Uint8Array : Array)(256);
					var y;
					for (y = 0; 256 > y; ++y) for (var A = y, ba = 7, A = A >>> 1; A; A >>>= 1) --ba;
					function B(e, b, d) {
						var c, a = "number" === typeof b ? b : b = 0, f = "number" === typeof d ? d : e.length;
						c = -1;
						for (a = f & 7; a--; ++b) c = c >>> 8 ^ C[(c ^ e[b]) & 255];
						for (a = f >> 3; a--; b += 8) c = c >>> 8 ^ C[(c ^ e[b]) & 255], c = c >>> 8 ^ C[(c ^ e[b + 1]) & 255], c = c >>> 8 ^ C[(c ^ e[b + 2]) & 255], c = c >>> 8 ^ C[(c ^ e[b + 3]) & 255], c = c >>> 8 ^ C[(c ^ e[b + 4]) & 255], c = c >>> 8 ^ C[(c ^ e[b + 5]) & 255], c = c >>> 8 ^ C[(c ^ e[b + 6]) & 255], c = c >>> 8 ^ C[(c ^ e[b + 7]) & 255];
						return (c ^ 4294967295) >>> 0;
					}
					var D = [
						0,
						1996959894,
						3993919788,
						2567524794,
						124634137,
						1886057615,
						3915621685,
						2657392035,
						249268274,
						2044508324,
						3772115230,
						2547177864,
						162941995,
						2125561021,
						3887607047,
						2428444049,
						498536548,
						1789927666,
						4089016648,
						2227061214,
						450548861,
						1843258603,
						4107580753,
						2211677639,
						325883990,
						1684777152,
						4251122042,
						2321926636,
						335633487,
						1661365465,
						4195302755,
						2366115317,
						997073096,
						1281953886,
						3579855332,
						2724688242,
						1006888145,
						1258607687,
						3524101629,
						2768942443,
						901097722,
						1119000684,
						3686517206,
						2898065728,
						853044451,
						1172266101,
						3705015759,
						2882616665,
						651767980,
						1373503546,
						3369554304,
						3218104598,
						565507253,
						1454621731,
						3485111705,
						3099436303,
						671266974,
						1594198024,
						3322730930,
						2970347812,
						795835527,
						1483230225,
						3244367275,
						3060149565,
						1994146192,
						31158534,
						2563907772,
						4023717930,
						1907459465,
						112637215,
						2680153253,
						3904427059,
						2013776290,
						251722036,
						2517215374,
						3775830040,
						2137656763,
						141376813,
						2439277719,
						3865271297,
						1802195444,
						476864866,
						2238001368,
						4066508878,
						1812370925,
						453092731,
						2181625025,
						4111451223,
						1706088902,
						314042704,
						2344532202,
						4240017532,
						1658658271,
						366619977,
						2362670323,
						4224994405,
						1303535960,
						984961486,
						2747007092,
						3569037538,
						1256170817,
						1037604311,
						2765210733,
						3554079995,
						1131014506,
						879679996,
						2909243462,
						3663771856,
						1141124467,
						855842277,
						2852801631,
						3708648649,
						1342533948,
						654459306,
						3188396048,
						3373015174,
						1466479909,
						544179635,
						3110523913,
						3462522015,
						1591671054,
						702138776,
						2966460450,
						3352799412,
						1504918807,
						783551873,
						3082640443,
						3233442989,
						3988292384,
						2596254646,
						62317068,
						1957810842,
						3939845945,
						2647816111,
						81470997,
						1943803523,
						3814918930,
						2489596804,
						225274430,
						2053790376,
						3826175755,
						2466906013,
						167816743,
						2097651377,
						4027552580,
						2265490386,
						503444072,
						1762050814,
						4150417245,
						2154129355,
						426522225,
						1852507879,
						4275313526,
						2312317920,
						282753626,
						1742555852,
						4189708143,
						2394877945,
						397917763,
						1622183637,
						3604390888,
						2714866558,
						953729732,
						1340076626,
						3518719985,
						2797360999,
						1068828381,
						1219638859,
						3624741850,
						2936675148,
						906185462,
						1090812512,
						3747672003,
						2825379669,
						829329135,
						1181335161,
						3412177804,
						3160834842,
						628085408,
						1382605366,
						3423369109,
						3138078467,
						570562233,
						1426400815,
						3317316542,
						2998733608,
						733239954,
						1555261956,
						3268935591,
						3050360625,
						752459403,
						1541320221,
						2607071920,
						3965973030,
						1969922972,
						40735498,
						2617837225,
						3943577151,
						1913087877,
						83908371,
						2512341634,
						3803740692,
						2075208622,
						213261112,
						2463272603,
						3855990285,
						2094854071,
						198958881,
						2262029012,
						4057260610,
						1759359992,
						534414190,
						2176718541,
						4139329115,
						1873836001,
						414664567,
						2282248934,
						4279200368,
						1711684554,
						285281116,
						2405801727,
						4167216745,
						1634467795,
						376229701,
						2685067896,
						3608007406,
						1308918612,
						956543938,
						2808555105,
						3495958263,
						1231636301,
						1047427035,
						2932959818,
						3654703836,
						1088359270,
						936918e3,
						2847714899,
						3736837829,
						1202900863,
						817233897,
						3183342108,
						3401237130,
						1404277552,
						615818150,
						3134207493,
						3453421203,
						1423857449,
						601450431,
						3009837614,
						3294710456,
						1567103746,
						711928724,
						3020668471,
						3272380065,
						1510334235,
						755167117
					], C = x ? new Uint32Array(D) : D;
					function E() {}
					E.prototype.getName = function() {
						return this.name;
					};
					E.prototype.getData = function() {
						return this.data;
					};
					E.prototype.G = function() {
						return this.H;
					};
					function G(e) {
						var b = e.length, d = 0, c = Number.POSITIVE_INFINITY, a, f, k, l, m, r, q, g, h, v;
						for (g = 0; g < b; ++g) e[g] > d && (d = e[g]), e[g] < c && (c = e[g]);
						a = 1 << d;
						f = new (x ? Uint32Array : Array)(a);
						k = 1;
						l = 0;
						for (m = 2; k <= d;) {
							for (g = 0; g < b; ++g) if (e[g] === k) {
								r = 0;
								q = l;
								for (h = 0; h < k; ++h) r = r << 1 | q & 1, q >>= 1;
								v = k << 16 | g;
								for (h = r; h < a; h += m) f[h] = v;
								++l;
							}
							++k;
							l <<= 1;
							m <<= 1;
						}
						return [
							f,
							d,
							c
						];
					}
					var J = [], K;
					for (K = 0; 288 > K; K++) switch (!0) {
						case 143 >= K:
							J.push([K + 48, 8]);
							break;
						case 255 >= K:
							J.push([K - 144 + 400, 9]);
							break;
						case 279 >= K:
							J.push([K - 256 + 0, 7]);
							break;
						case 287 >= K:
							J.push([K - 280 + 192, 8]);
							break;
						default: n("invalid literal: " + K);
					}
					var ca = function() {
						function e(a) {
							switch (!0) {
								case 3 === a: return [
									257,
									a - 3,
									0
								];
								case 4 === a: return [
									258,
									a - 4,
									0
								];
								case 5 === a: return [
									259,
									a - 5,
									0
								];
								case 6 === a: return [
									260,
									a - 6,
									0
								];
								case 7 === a: return [
									261,
									a - 7,
									0
								];
								case 8 === a: return [
									262,
									a - 8,
									0
								];
								case 9 === a: return [
									263,
									a - 9,
									0
								];
								case 10 === a: return [
									264,
									a - 10,
									0
								];
								case 12 >= a: return [
									265,
									a - 11,
									1
								];
								case 14 >= a: return [
									266,
									a - 13,
									1
								];
								case 16 >= a: return [
									267,
									a - 15,
									1
								];
								case 18 >= a: return [
									268,
									a - 17,
									1
								];
								case 22 >= a: return [
									269,
									a - 19,
									2
								];
								case 26 >= a: return [
									270,
									a - 23,
									2
								];
								case 30 >= a: return [
									271,
									a - 27,
									2
								];
								case 34 >= a: return [
									272,
									a - 31,
									2
								];
								case 42 >= a: return [
									273,
									a - 35,
									3
								];
								case 50 >= a: return [
									274,
									a - 43,
									3
								];
								case 58 >= a: return [
									275,
									a - 51,
									3
								];
								case 66 >= a: return [
									276,
									a - 59,
									3
								];
								case 82 >= a: return [
									277,
									a - 67,
									4
								];
								case 98 >= a: return [
									278,
									a - 83,
									4
								];
								case 114 >= a: return [
									279,
									a - 99,
									4
								];
								case 130 >= a: return [
									280,
									a - 115,
									4
								];
								case 162 >= a: return [
									281,
									a - 131,
									5
								];
								case 194 >= a: return [
									282,
									a - 163,
									5
								];
								case 226 >= a: return [
									283,
									a - 195,
									5
								];
								case 257 >= a: return [
									284,
									a - 227,
									5
								];
								case 258 === a: return [
									285,
									a - 258,
									0
								];
								default: n("invalid length: " + a);
							}
						}
						var b = [], d, c;
						for (d = 3; 258 >= d; d++) c = e(d), b[d] = c[2] << 24 | c[1] << 16 | c[0];
						return b;
					}();
					x && new Uint32Array(ca);
					function L(e, b) {
						this.i = [];
						this.j = 32768;
						this.d = this.f = this.c = this.n = 0;
						this.input = x ? new Uint8Array(e) : e;
						this.o = !1;
						this.k = M;
						this.w = !1;
						if (b || !(b = {})) b.index && (this.c = b.index), b.bufferSize && (this.j = b.bufferSize), b.bufferType && (this.k = b.bufferType), b.resize && (this.w = b.resize);
						switch (this.k) {
							case N:
								this.a = 32768;
								this.b = new (x ? Uint8Array : Array)(32768 + this.j + 258);
								break;
							case M:
								this.a = 0;
								this.b = new (x ? Uint8Array : Array)(this.j);
								this.e = this.D;
								this.q = this.A;
								this.l = this.C;
								break;
							default: n(Error("invalid inflate mode"));
						}
					}
					var N = 0, M = 1;
					L.prototype.g = function() {
						for (; !this.o;) {
							var e = P(this, 3);
							e & 1 && (this.o = !0);
							e >>>= 1;
							switch (e) {
								case 0:
									var b = this.input, d = this.c, c = this.b, a = this.a, f = b.length, k = p, l = p, m = c.length, r = p;
									this.d = this.f = 0;
									d + 1 >= f && n(Error("invalid uncompressed block header: LEN"));
									k = b[d++] | b[d++] << 8;
									d + 1 >= f && n(Error("invalid uncompressed block header: NLEN"));
									l = b[d++] | b[d++] << 8;
									k === ~l && n(Error("invalid uncompressed block header: length verify"));
									d + k > b.length && n(Error("input buffer is broken"));
									switch (this.k) {
										case N:
											for (; a + k > c.length;) {
												r = m - a;
												k -= r;
												if (x) c.set(b.subarray(d, d + r), a), a += r, d += r;
												else for (; r--;) c[a++] = b[d++];
												this.a = a;
												c = this.e();
												a = this.a;
											}
											break;
										case M:
											for (; a + k > c.length;) c = this.e({ t: 2 });
											break;
										default: n(Error("invalid inflate mode"));
									}
									if (x) c.set(b.subarray(d, d + k), a), a += k, d += k;
									else for (; k--;) c[a++] = b[d++];
									this.c = d;
									this.a = a;
									this.b = c;
									break;
								case 1:
									this.l(da, ea);
									break;
								case 2:
									for (var q = P(this, 5) + 257, g = P(this, 5) + 1, h = P(this, 4) + 4, v = new (x ? Uint8Array : Array)(Q.length), s = p, F = p, H = p, w = p, z = p, O = p, I = p, u = p, Z = p, u = 0; u < h; ++u) v[Q[u]] = P(this, 3);
									if (!x) {
										u = h;
										for (h = v.length; u < h; ++u) v[Q[u]] = 0;
									}
									s = G(v);
									w = new (x ? Uint8Array : Array)(q + g);
									u = 0;
									for (Z = q + g; u < Z;) switch (z = R(this, s), z) {
										case 16:
											for (I = 3 + P(this, 2); I--;) w[u++] = O;
											break;
										case 17:
											for (I = 3 + P(this, 3); I--;) w[u++] = 0;
											O = 0;
											break;
										case 18:
											for (I = 11 + P(this, 7); I--;) w[u++] = 0;
											O = 0;
											break;
										default: O = w[u++] = z;
									}
									F = x ? G(w.subarray(0, q)) : G(w.slice(0, q));
									H = x ? G(w.subarray(q)) : G(w.slice(q));
									this.l(F, H);
									break;
								default: n(Error("unknown BTYPE: " + e));
							}
						}
						return this.q();
					};
					var S = [
						16,
						17,
						18,
						0,
						8,
						7,
						9,
						6,
						10,
						5,
						11,
						4,
						12,
						3,
						13,
						2,
						14,
						1,
						15
					], Q = x ? new Uint16Array(S) : S, fa = [
						3,
						4,
						5,
						6,
						7,
						8,
						9,
						10,
						11,
						13,
						15,
						17,
						19,
						23,
						27,
						31,
						35,
						43,
						51,
						59,
						67,
						83,
						99,
						115,
						131,
						163,
						195,
						227,
						258,
						258,
						258
					], ga = x ? new Uint16Array(fa) : fa, ha = [
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						1,
						1,
						1,
						1,
						2,
						2,
						2,
						2,
						3,
						3,
						3,
						3,
						4,
						4,
						4,
						4,
						5,
						5,
						5,
						5,
						0,
						0,
						0
					], T = x ? new Uint8Array(ha) : ha, ia = [
						1,
						2,
						3,
						4,
						5,
						7,
						9,
						13,
						17,
						25,
						33,
						49,
						65,
						97,
						129,
						193,
						257,
						385,
						513,
						769,
						1025,
						1537,
						2049,
						3073,
						4097,
						6145,
						8193,
						12289,
						16385,
						24577
					], ja = x ? new Uint16Array(ia) : ia, ka = [
						0,
						0,
						0,
						0,
						1,
						1,
						2,
						2,
						3,
						3,
						4,
						4,
						5,
						5,
						6,
						6,
						7,
						7,
						8,
						8,
						9,
						9,
						10,
						10,
						11,
						11,
						12,
						12,
						13,
						13
					], U = x ? new Uint8Array(ka) : ka, V = new (x ? Uint8Array : Array)(288), W = 0, la;
					for (la = V.length; W < la; ++W) V[W] = 143 >= W ? 8 : 255 >= W ? 9 : 279 >= W ? 7 : 8;
					var da = G(V), X = new (x ? Uint8Array : Array)(30), Y = 0, ma;
					for (ma = X.length; Y < ma; ++Y) X[Y] = 5;
					var ea = G(X);
					function P(e, b) {
						for (var d = e.f, c = e.d, a = e.input, f = e.c, k = a.length, l; c < b;) f >= k && n(Error("input buffer is broken")), d |= a[f++] << c, c += 8;
						l = d & (1 << b) - 1;
						e.f = d >>> b;
						e.d = c - b;
						e.c = f;
						return l;
					}
					function R(e, b) {
						for (var d = e.f, c = e.d, a = e.input, f = e.c, k = a.length, l = b[0], m = b[1], r, q; c < m && !(f >= k);) d |= a[f++] << c, c += 8;
						r = l[d & (1 << m) - 1];
						q = r >>> 16;
						q > c && n(Error("invalid code length: " + q));
						e.f = d >> q;
						e.d = c - q;
						e.c = f;
						return r & 65535;
					}
					L.prototype.l = function(e, b) {
						var d = this.b, c = this.a;
						this.r = e;
						for (var a = d.length - 258, f, k, l, m; 256 !== (f = R(this, e));) if (256 > f) c >= a && (this.a = c, d = this.e(), c = this.a), d[c++] = f;
						else {
							k = f - 257;
							m = ga[k];
							0 < T[k] && (m += P(this, T[k]));
							f = R(this, b);
							l = ja[f];
							0 < U[f] && (l += P(this, U[f]));
							c >= a && (this.a = c, d = this.e(), c = this.a);
							for (; m--;) d[c] = d[c++ - l];
						}
						for (; 8 <= this.d;) this.d -= 8, this.c--;
						this.a = c;
					};
					L.prototype.C = function(e, b) {
						var d = this.b, c = this.a;
						this.r = e;
						for (var a = d.length, f, k, l, m; 256 !== (f = R(this, e));) if (256 > f) c >= a && (d = this.e(), a = d.length), d[c++] = f;
						else {
							k = f - 257;
							m = ga[k];
							0 < T[k] && (m += P(this, T[k]));
							f = R(this, b);
							l = ja[f];
							0 < U[f] && (l += P(this, U[f]));
							c + m > a && (d = this.e(), a = d.length);
							for (; m--;) d[c] = d[c++ - l];
						}
						for (; 8 <= this.d;) this.d -= 8, this.c--;
						this.a = c;
					};
					L.prototype.e = function() {
						var e = new (x ? Uint8Array : Array)(this.a - 32768), b = this.a - 32768, d, c, a = this.b;
						if (x) e.set(a.subarray(32768, e.length));
						else {
							d = 0;
							for (c = e.length; d < c; ++d) e[d] = a[d + 32768];
						}
						this.i.push(e);
						this.n += e.length;
						if (x) a.set(a.subarray(b, b + 32768));
						else for (d = 0; 32768 > d; ++d) a[d] = a[b + d];
						this.a = 32768;
						return a;
					};
					L.prototype.D = function(e) {
						var b, d = this.input.length / this.c + 1 | 0, c, a, f, k = this.input, l = this.b;
						e && ("number" === typeof e.t && (d = e.t), "number" === typeof e.z && (d += e.z));
						2 > d ? (c = (k.length - this.c) / this.r[2], f = 258 * (c / 2) | 0, a = f < l.length ? l.length + f : l.length << 1) : a = l.length * d;
						x ? (b = new Uint8Array(a), b.set(l)) : b = l;
						return this.b = b;
					};
					L.prototype.q = function() {
						var e = 0, b = this.b, d = this.i, c, a = new (x ? Uint8Array : Array)(this.n + (this.a - 32768)), f, k, l, m;
						if (0 === d.length) return x ? this.b.subarray(32768, this.a) : this.b.slice(32768, this.a);
						f = 0;
						for (k = d.length; f < k; ++f) {
							c = d[f];
							l = 0;
							for (m = c.length; l < m; ++l) a[e++] = c[l];
						}
						f = 32768;
						for (k = this.a; f < k; ++f) a[e++] = b[f];
						this.i = [];
						return this.buffer = a;
					};
					L.prototype.A = function() {
						var e, b = this.a;
						x ? this.w ? (e = new Uint8Array(b), e.set(this.b.subarray(0, b))) : e = this.b.subarray(0, b) : (this.b.length > b && (this.b.length = b), e = this.b);
						return this.buffer = e;
					};
					function $(e) {
						this.input = e;
						this.c = 0;
						this.m = [];
						this.s = !1;
					}
					$.prototype.F = function() {
						this.s || this.g();
						return this.m.slice();
					};
					$.prototype.g = function() {
						for (var e = this.input.length; this.c < e;) {
							var b = new E(), d = p, c = p, a = p, f = p, k = p, l = p, m = p, r = p, q = p, g = this.input, h = this.c;
							b.u = g[h++];
							b.v = g[h++];
							(31 !== b.u || 139 !== b.v) && n(Error("invalid file signature:" + b.u + "," + b.v));
							b.p = g[h++];
							switch (b.p) {
								case 8: break;
								default: n(Error("unknown compression method: " + b.p));
							}
							b.h = g[h++];
							r = g[h++] | g[h++] << 8 | g[h++] << 16 | g[h++] << 24;
							b.H = /* @__PURE__ */ new Date(1e3 * r);
							b.N = g[h++];
							b.M = g[h++];
							0 < (b.h & 4) && (b.I = g[h++] | g[h++] << 8, h += b.I);
							if (0 < (b.h & 8)) {
								m = [];
								for (l = 0; 0 < (k = g[h++]);) m[l++] = String.fromCharCode(k);
								b.name = m.join("");
							}
							if (0 < (b.h & 16)) {
								m = [];
								for (l = 0; 0 < (k = g[h++]);) m[l++] = String.fromCharCode(k);
								b.J = m.join("");
							}
							0 < (b.h & 2) && (b.B = B(g, 0, h) & 65535, b.B !== (g[h++] | g[h++] << 8) && n(Error("invalid header crc16")));
							d = g[g.length - 4] | g[g.length - 3] << 8 | g[g.length - 2] << 16 | g[g.length - 1] << 24;
							g.length - h - 4 - 4 < 512 * d && (f = d);
							c = new L(g, {
								index: h,
								bufferSize: f
							});
							b.data = a = c.g();
							h = c.c;
							b.K = q = (g[h++] | g[h++] << 8 | g[h++] << 16 | g[h++] << 24) >>> 0;
							B(a, p, p) !== q && n(Error("invalid CRC-32 checksum: 0x" + B(a, p, p).toString(16) + " / 0x" + q.toString(16)));
							b.L = d = (g[h++] | g[h++] << 8 | g[h++] << 16 | g[h++] << 24) >>> 0;
							(a.length & 4294967295) !== d && n(Error("invalid input size: " + (a.length & 4294967295) + " / " + d));
							this.m.push(b);
							this.c = h;
						}
						this.s = !0;
						var v = this.m, s, F, H = 0, w = 0, z;
						s = 0;
						for (F = v.length; s < F; ++s) w += v[s].data.length;
						if (x) {
							z = new Uint8Array(w);
							for (s = 0; s < F; ++s) z.set(v[s].data, H), H += v[s].data.length;
						} else {
							z = [];
							for (s = 0; s < F; ++s) z[s] = v[s].data;
							z = Array.prototype.concat.apply([], z);
						}
						return z;
					};
					t("Zlib.Gunzip", $);
					t("Zlib.Gunzip.prototype.decompress", $.prototype.g);
					t("Zlib.Gunzip.prototype.getMembers", $.prototype.F);
					t("Zlib.GunzipMember", E);
					t("Zlib.GunzipMember.prototype.getName", E.prototype.getName);
					t("Zlib.GunzipMember.prototype.getData", E.prototype.getData);
					t("Zlib.GunzipMember.prototype.getMtime", E.prototype.G);
				}).call(this);
			}, {}],
			6: [function(require, module$6, exports$7) {
				"use strict";
				var ViterbiBuilder = require("./viterbi/ViterbiBuilder");
				var ViterbiSearcher = require("./viterbi/ViterbiSearcher");
				var IpadicFormatter = require("./util/IpadicFormatter");
				var PUNCTUATION = /、|。/;
				/**
				* Tokenizer
				* @param {DynamicDictionaries} dic Dictionaries used by this tokenizer
				* @constructor
				*/
				function Tokenizer(dic) {
					this.token_info_dictionary = dic.token_info_dictionary;
					this.unknown_dictionary = dic.unknown_dictionary;
					this.viterbi_builder = new ViterbiBuilder(dic);
					this.viterbi_searcher = new ViterbiSearcher(dic.connection_costs);
					this.formatter = new IpadicFormatter();
				}
				/**
				* Split into sentence by punctuation
				* @param {string} input Input text
				* @returns {Array.<string>} Sentences end with punctuation
				*/
				Tokenizer.splitByPunctuation = function(input) {
					var sentences = [];
					var tail = input;
					while (true) {
						if (tail === "") break;
						var index = tail.search(PUNCTUATION);
						if (index < 0) {
							sentences.push(tail);
							break;
						}
						sentences.push(tail.substring(0, index + 1));
						tail = tail.substring(index + 1);
					}
					return sentences;
				};
				/**
				* Tokenize text
				* @param {string} text Input text to analyze
				* @returns {Array} Tokens
				*/
				Tokenizer.prototype.tokenize = function(text) {
					var sentences = Tokenizer.splitByPunctuation(text);
					var tokens = [];
					for (var i = 0; i < sentences.length; i++) {
						var sentence = sentences[i];
						this.tokenizeForSentence(sentence, tokens);
					}
					return tokens;
				};
				Tokenizer.prototype.tokenizeForSentence = function(sentence, tokens) {
					if (tokens == null) tokens = [];
					var lattice = this.getLattice(sentence);
					var best_path = this.viterbi_searcher.search(lattice);
					var last_pos = 0;
					if (tokens.length > 0) last_pos = tokens[tokens.length - 1].word_position;
					for (var j = 0; j < best_path.length; j++) {
						var node = best_path[j];
						var token, features, features_line;
						if (node.type === "KNOWN") {
							features_line = this.token_info_dictionary.getFeatures(node.name);
							if (features_line == null) features = [];
							else features = features_line.split(",");
							token = this.formatter.formatEntry(node.name, last_pos + node.start_pos, node.type, features);
						} else if (node.type === "UNKNOWN") {
							features_line = this.unknown_dictionary.getFeatures(node.name);
							if (features_line == null) features = [];
							else features = features_line.split(",");
							token = this.formatter.formatUnknownEntry(node.name, last_pos + node.start_pos, node.type, features, node.surface_form);
						} else token = this.formatter.formatEntry(node.name, last_pos + node.start_pos, node.type, []);
						tokens.push(token);
					}
					return tokens;
				};
				/**
				* Build word lattice
				* @param {string} text Input text to analyze
				* @returns {ViterbiLattice} Word lattice
				*/
				Tokenizer.prototype.getLattice = function(text) {
					return this.viterbi_builder.build(text);
				};
				module$6.exports = Tokenizer;
			}, {
				"./util/IpadicFormatter": 22,
				"./viterbi/ViterbiBuilder": 24,
				"./viterbi/ViterbiSearcher": 27
			}],
			7: [function(require, module$7, exports$8) {
				"use strict";
				var Tokenizer = require("./Tokenizer");
				var DictionaryLoader = require("./loader/NodeDictionaryLoader");
				/**
				* TokenizerBuilder create Tokenizer instance.
				* @param {Object} option JSON object which have key-value pairs settings
				* @param {string} option.dicPath Dictionary directory path (or URL using in browser)
				* @constructor
				*/
				function TokenizerBuilder(option) {
					if (option.dicPath == null) this.dic_path = "dict/";
					else this.dic_path = option.dicPath;
				}
				/**
				* Build Tokenizer instance by asynchronous manner
				* @param {TokenizerBuilder~onLoad} callback Callback function
				*/
				TokenizerBuilder.prototype.build = function(callback) {
					new DictionaryLoader(this.dic_path).load(function(err, dic) {
						callback(err, new Tokenizer(dic));
					});
				};
				/**
				* Callback used by build
				* @callback TokenizerBuilder~onLoad
				* @param {Object} err Error object
				* @param {Tokenizer} tokenizer Prepared Tokenizer
				*/
				module$7.exports = TokenizerBuilder;
			}, {
				"./Tokenizer": 6,
				"./loader/NodeDictionaryLoader": 19
			}],
			8: [function(require, module$8, exports$9) {
				"use strict";
				/**
				* CharacterClass
				* @param {number} class_id
				* @param {string} class_name
				* @param {boolean} is_always_invoke
				* @param {boolean} is_grouping
				* @param {number} max_length
				* @constructor
				*/
				function CharacterClass(class_id, class_name, is_always_invoke, is_grouping, max_length) {
					this.class_id = class_id;
					this.class_name = class_name;
					this.is_always_invoke = is_always_invoke;
					this.is_grouping = is_grouping;
					this.max_length = max_length;
				}
				module$8.exports = CharacterClass;
			}, {}],
			9: [function(require, module$9, exports$10) {
				"use strict";
				var InvokeDefinitionMap = require("./InvokeDefinitionMap");
				var CharacterClass = require("./CharacterClass");
				var SurrogateAwareString = require("../util/SurrogateAwareString");
				var DEFAULT_CATEGORY = "DEFAULT";
				/**
				* CharacterDefinition represents char.def file and
				* defines behavior of unknown word processing
				* @constructor
				*/
				function CharacterDefinition() {
					this.character_category_map = new Uint8Array(65536);
					this.compatible_category_map = new Uint32Array(65536);
					this.invoke_definition_map = null;
				}
				/**
				* Load CharacterDefinition
				* @param {Uint8Array} cat_map_buffer
				* @param {Uint32Array} compat_cat_map_buffer
				* @param {InvokeDefinitionMap} invoke_def_buffer
				* @returns {CharacterDefinition}
				*/
				CharacterDefinition.load = function(cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
					var char_def = new CharacterDefinition();
					char_def.character_category_map = cat_map_buffer;
					char_def.compatible_category_map = compat_cat_map_buffer;
					char_def.invoke_definition_map = InvokeDefinitionMap.load(invoke_def_buffer);
					return char_def;
				};
				CharacterDefinition.parseCharCategory = function(class_id, parsed_category_def) {
					var category = parsed_category_def[1];
					var invoke = parseInt(parsed_category_def[2]);
					var grouping = parseInt(parsed_category_def[3]);
					var max_length = parseInt(parsed_category_def[4]);
					if (!isFinite(invoke) || invoke !== 0 && invoke !== 1) {
						console.log("char.def parse error. INVOKE is 0 or 1 in:" + invoke);
						return null;
					}
					if (!isFinite(grouping) || grouping !== 0 && grouping !== 1) {
						console.log("char.def parse error. GROUP is 0 or 1 in:" + grouping);
						return null;
					}
					if (!isFinite(max_length) || max_length < 0) {
						console.log("char.def parse error. LENGTH is 1 to n:" + max_length);
						return null;
					}
					return new CharacterClass(class_id, category, invoke === 1, grouping === 1, max_length);
				};
				CharacterDefinition.parseCategoryMapping = function(parsed_category_mapping) {
					var start = parseInt(parsed_category_mapping[1]);
					var default_category = parsed_category_mapping[2];
					var compatible_category = 3 < parsed_category_mapping.length ? parsed_category_mapping.slice(3) : [];
					if (!isFinite(start) || start < 0 || start > 65535) console.log("char.def parse error. CODE is invalid:" + start);
					return {
						start,
						default: default_category,
						compatible: compatible_category
					};
				};
				CharacterDefinition.parseRangeCategoryMapping = function(parsed_category_mapping) {
					var start = parseInt(parsed_category_mapping[1]);
					var end = parseInt(parsed_category_mapping[2]);
					var default_category = parsed_category_mapping[3];
					var compatible_category = 4 < parsed_category_mapping.length ? parsed_category_mapping.slice(4) : [];
					if (!isFinite(start) || start < 0 || start > 65535) console.log("char.def parse error. CODE is invalid:" + start);
					if (!isFinite(end) || end < 0 || end > 65535) console.log("char.def parse error. CODE is invalid:" + end);
					return {
						start,
						end,
						default: default_category,
						compatible: compatible_category
					};
				};
				/**
				* Initializing method
				* @param {Array} category_mapping Array of category mapping
				*/
				CharacterDefinition.prototype.initCategoryMappings = function(category_mapping) {
					var code_point;
					if (category_mapping != null) for (var i = 0; i < category_mapping.length; i++) {
						var mapping = category_mapping[i];
						var end = mapping.end || mapping.start;
						for (code_point = mapping.start; code_point <= end; code_point++) {
							this.character_category_map[code_point] = this.invoke_definition_map.lookup(mapping.default);
							for (var j = 0; j < mapping.compatible.length; j++) {
								var bitset = this.compatible_category_map[code_point];
								var compatible_category = mapping.compatible[j];
								if (compatible_category == null) continue;
								var class_id = this.invoke_definition_map.lookup(compatible_category);
								if (class_id == null) continue;
								var class_id_bit = 1 << class_id;
								bitset = bitset | class_id_bit;
								this.compatible_category_map[code_point] = bitset;
							}
						}
					}
					var default_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY);
					if (default_id == null) return;
					for (code_point = 0; code_point < this.character_category_map.length; code_point++) if (this.character_category_map[code_point] === 0) this.character_category_map[code_point] = 1 << default_id;
				};
				/**
				* Lookup compatible categories for a character (not included 1st category)
				* @param {string} ch UCS2 character (just 1st character is effective)
				* @returns {Array.<CharacterClass>} character classes
				*/
				CharacterDefinition.prototype.lookupCompatibleCategory = function(ch) {
					var classes = [];
					var code = ch.charCodeAt(0);
					var integer;
					if (code < this.compatible_category_map.length) integer = this.compatible_category_map[code];
					if (integer == null || integer === 0) return classes;
					for (var bit = 0; bit < 32; bit++) if (integer << 31 - bit >>> 31 === 1) {
						var character_class = this.invoke_definition_map.getCharacterClass(bit);
						if (character_class == null) continue;
						classes.push(character_class);
					}
					return classes;
				};
				/**
				* Lookup category for a character
				* @param {string} ch UCS2 character (just 1st character is effective)
				* @returns {CharacterClass} character class
				*/
				CharacterDefinition.prototype.lookup = function(ch) {
					var class_id;
					var code = ch.charCodeAt(0);
					if (SurrogateAwareString.isSurrogatePair(ch)) class_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY);
					else if (code < this.character_category_map.length) class_id = this.character_category_map[code];
					if (class_id == null) class_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY);
					return this.invoke_definition_map.getCharacterClass(class_id);
				};
				module$9.exports = CharacterDefinition;
			}, {
				"../util/SurrogateAwareString": 23,
				"./CharacterClass": 8,
				"./InvokeDefinitionMap": 12
			}],
			10: [function(require, module$10, exports$11) {
				"use strict";
				/**
				* Connection costs matrix from cc.dat file.
				* 2 dimension matrix [forward_id][backward_id] -> cost
				* @constructor
				* @param {number} forward_dimension
				* @param {number} backward_dimension
				*/
				function ConnectionCosts(forward_dimension, backward_dimension) {
					this.forward_dimension = forward_dimension;
					this.backward_dimension = backward_dimension;
					this.buffer = new Int16Array(forward_dimension * backward_dimension + 2);
					this.buffer[0] = forward_dimension;
					this.buffer[1] = backward_dimension;
				}
				ConnectionCosts.prototype.put = function(forward_id, backward_id, cost) {
					var index = forward_id * this.backward_dimension + backward_id + 2;
					if (this.buffer.length < index + 1) throw "ConnectionCosts buffer overflow";
					this.buffer[index] = cost;
				};
				ConnectionCosts.prototype.get = function(forward_id, backward_id) {
					var index = forward_id * this.backward_dimension + backward_id + 2;
					if (this.buffer.length < index + 1) throw "ConnectionCosts buffer overflow";
					return this.buffer[index];
				};
				ConnectionCosts.prototype.loadConnectionCosts = function(connection_costs_buffer) {
					this.forward_dimension = connection_costs_buffer[0];
					this.backward_dimension = connection_costs_buffer[1];
					this.buffer = connection_costs_buffer;
				};
				module$10.exports = ConnectionCosts;
			}, {}],
			11: [function(require, module$11, exports$12) {
				"use strict";
				var doublearray = require("doublearray");
				var TokenInfoDictionary = require("./TokenInfoDictionary");
				var ConnectionCosts = require("./ConnectionCosts");
				var UnknownDictionary = require("./UnknownDictionary");
				/**
				* Dictionaries container for Tokenizer
				* @param {DoubleArray} trie
				* @param {TokenInfoDictionary} token_info_dictionary
				* @param {ConnectionCosts} connection_costs
				* @param {UnknownDictionary} unknown_dictionary
				* @constructor
				*/
				function DynamicDictionaries(trie, token_info_dictionary, connection_costs, unknown_dictionary) {
					if (trie != null) this.trie = trie;
					else this.trie = doublearray.builder(0).build([{
						k: "",
						v: 1
					}]);
					if (token_info_dictionary != null) this.token_info_dictionary = token_info_dictionary;
					else this.token_info_dictionary = new TokenInfoDictionary();
					if (connection_costs != null) this.connection_costs = connection_costs;
					else this.connection_costs = new ConnectionCosts(0, 0);
					if (unknown_dictionary != null) this.unknown_dictionary = unknown_dictionary;
					else this.unknown_dictionary = new UnknownDictionary();
				}
				DynamicDictionaries.prototype.loadTrie = function(base_buffer, check_buffer) {
					this.trie = doublearray.load(base_buffer, check_buffer);
					return this;
				};
				DynamicDictionaries.prototype.loadTokenInfoDictionaries = function(token_info_buffer, pos_buffer, target_map_buffer) {
					this.token_info_dictionary.loadDictionary(token_info_buffer);
					this.token_info_dictionary.loadPosVector(pos_buffer);
					this.token_info_dictionary.loadTargetMap(target_map_buffer);
					return this;
				};
				DynamicDictionaries.prototype.loadConnectionCosts = function(cc_buffer) {
					this.connection_costs.loadConnectionCosts(cc_buffer);
					return this;
				};
				DynamicDictionaries.prototype.loadUnknownDictionaries = function(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
					this.unknown_dictionary.loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer);
					return this;
				};
				module$11.exports = DynamicDictionaries;
			}, {
				"./ConnectionCosts": 10,
				"./TokenInfoDictionary": 13,
				"./UnknownDictionary": 14,
				"doublearray": 2
			}],
			12: [function(require, module$12, exports$13) {
				"use strict";
				var ByteBuffer = require("../util/ByteBuffer");
				var CharacterClass = require("./CharacterClass");
				/**
				* InvokeDefinitionMap represents invoke definition a part of char.def
				* @constructor
				*/
				function InvokeDefinitionMap() {
					this.map = [];
					this.lookup_table = {};
				}
				/**
				* Load InvokeDefinitionMap from buffer
				* @param {Uint8Array} invoke_def_buffer
				* @returns {InvokeDefinitionMap}
				*/
				InvokeDefinitionMap.load = function(invoke_def_buffer) {
					var invoke_def = new InvokeDefinitionMap();
					var character_category_definition = [];
					var buffer = new ByteBuffer(invoke_def_buffer);
					while (buffer.position + 1 < buffer.size()) {
						var class_id = character_category_definition.length;
						var is_always_invoke = buffer.get();
						var is_grouping = buffer.get();
						var max_length = buffer.getInt();
						var class_name = buffer.getString();
						character_category_definition.push(new CharacterClass(class_id, class_name, is_always_invoke, is_grouping, max_length));
					}
					invoke_def.init(character_category_definition);
					return invoke_def;
				};
				/**
				* Initializing method
				* @param {Array.<CharacterClass>} character_category_definition Array of CharacterClass
				*/
				InvokeDefinitionMap.prototype.init = function(character_category_definition) {
					if (character_category_definition == null) return;
					for (var i = 0; i < character_category_definition.length; i++) {
						var character_class = character_category_definition[i];
						this.map[i] = character_class;
						this.lookup_table[character_class.class_name] = i;
					}
				};
				/**
				* Get class information by class ID
				* @param {number} class_id
				* @returns {CharacterClass}
				*/
				InvokeDefinitionMap.prototype.getCharacterClass = function(class_id) {
					return this.map[class_id];
				};
				/**
				* For building character definition dictionary
				* @param {string} class_name character
				* @returns {number} class_id
				*/
				InvokeDefinitionMap.prototype.lookup = function(class_name) {
					var class_id = this.lookup_table[class_name];
					if (class_id == null) return null;
					return class_id;
				};
				/**
				* Transform from map to binary buffer
				* @returns {Uint8Array}
				*/
				InvokeDefinitionMap.prototype.toBuffer = function() {
					var buffer = new ByteBuffer();
					for (var i = 0; i < this.map.length; i++) {
						var char_class = this.map[i];
						buffer.put(char_class.is_always_invoke);
						buffer.put(char_class.is_grouping);
						buffer.putInt(char_class.max_length);
						buffer.putString(char_class.class_name);
					}
					buffer.shrink();
					return buffer.buffer;
				};
				module$12.exports = InvokeDefinitionMap;
			}, {
				"../util/ByteBuffer": 21,
				"./CharacterClass": 8
			}],
			13: [function(require, module$13, exports$14) {
				"use strict";
				var ByteBuffer = require("../util/ByteBuffer");
				/**
				* TokenInfoDictionary
				* @constructor
				*/
				function TokenInfoDictionary() {
					this.dictionary = new ByteBuffer(10 * 1024 * 1024);
					this.target_map = {};
					this.pos_buffer = new ByteBuffer(10 * 1024 * 1024);
				}
				TokenInfoDictionary.prototype.buildDictionary = function(entries) {
					var dictionary_entries = {};
					for (var i = 0; i < entries.length; i++) {
						var entry = entries[i];
						if (entry.length < 4) continue;
						var surface_form = entry[0];
						var left_id = entry[1];
						var right_id = entry[2];
						var word_cost = entry[3];
						var feature = entry.slice(4).join(",");
						if (!isFinite(left_id) || !isFinite(right_id) || !isFinite(word_cost)) console.log(entry);
						var token_info_id = this.put(left_id, right_id, word_cost, surface_form, feature);
						dictionary_entries[token_info_id] = surface_form;
					}
					this.dictionary.shrink();
					this.pos_buffer.shrink();
					return dictionary_entries;
				};
				TokenInfoDictionary.prototype.put = function(left_id, right_id, word_cost, surface_form, feature) {
					var token_info_id = this.dictionary.position;
					var pos_id = this.pos_buffer.position;
					this.dictionary.putShort(left_id);
					this.dictionary.putShort(right_id);
					this.dictionary.putShort(word_cost);
					this.dictionary.putInt(pos_id);
					this.pos_buffer.putString(surface_form + "," + feature);
					return token_info_id;
				};
				TokenInfoDictionary.prototype.addMapping = function(source, target) {
					var mapping = this.target_map[source];
					if (mapping == null) mapping = [];
					mapping.push(target);
					this.target_map[source] = mapping;
				};
				TokenInfoDictionary.prototype.targetMapToBuffer = function() {
					var buffer = new ByteBuffer();
					var map_keys_size = Object.keys(this.target_map).length;
					buffer.putInt(map_keys_size);
					for (var key in this.target_map) {
						var values = this.target_map[key];
						var map_values_size = values.length;
						buffer.putInt(parseInt(key));
						buffer.putInt(map_values_size);
						for (var i = 0; i < values.length; i++) buffer.putInt(values[i]);
					}
					return buffer.shrink();
				};
				TokenInfoDictionary.prototype.loadDictionary = function(array_buffer) {
					this.dictionary = new ByteBuffer(array_buffer);
					return this;
				};
				TokenInfoDictionary.prototype.loadPosVector = function(array_buffer) {
					this.pos_buffer = new ByteBuffer(array_buffer);
					return this;
				};
				TokenInfoDictionary.prototype.loadTargetMap = function(array_buffer) {
					var buffer = new ByteBuffer(array_buffer);
					buffer.position = 0;
					this.target_map = {};
					buffer.readInt();
					while (true) {
						if (buffer.buffer.length < buffer.position + 1) break;
						var key = buffer.readInt();
						var map_values_size = buffer.readInt();
						for (var i = 0; i < map_values_size; i++) {
							var value = buffer.readInt();
							this.addMapping(key, value);
						}
					}
					return this;
				};
				/**
				* Look up features in the dictionary
				* @param {string} token_info_id_str Word ID to look up
				* @returns {string} Features string concatenated by ","
				*/
				TokenInfoDictionary.prototype.getFeatures = function(token_info_id_str) {
					var token_info_id = parseInt(token_info_id_str);
					if (isNaN(token_info_id)) return "";
					var pos_id = this.dictionary.getInt(token_info_id + 6);
					return this.pos_buffer.getString(pos_id);
				};
				module$13.exports = TokenInfoDictionary;
			}, { "../util/ByteBuffer": 21 }],
			14: [function(require, module$14, exports$15) {
				"use strict";
				var TokenInfoDictionary = require("./TokenInfoDictionary");
				var CharacterDefinition = require("./CharacterDefinition");
				var ByteBuffer = require("../util/ByteBuffer");
				/**
				* UnknownDictionary
				* @constructor
				*/
				function UnknownDictionary() {
					this.dictionary = new ByteBuffer(10 * 1024 * 1024);
					this.target_map = {};
					this.pos_buffer = new ByteBuffer(10 * 1024 * 1024);
					this.character_definition = null;
				}
				UnknownDictionary.prototype = Object.create(TokenInfoDictionary.prototype);
				UnknownDictionary.prototype.characterDefinition = function(character_definition) {
					this.character_definition = character_definition;
					return this;
				};
				UnknownDictionary.prototype.lookup = function(ch) {
					return this.character_definition.lookup(ch);
				};
				UnknownDictionary.prototype.lookupCompatibleCategory = function(ch) {
					return this.character_definition.lookupCompatibleCategory(ch);
				};
				UnknownDictionary.prototype.loadUnknownDictionaries = function(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
					this.loadDictionary(unk_buffer);
					this.loadPosVector(unk_pos_buffer);
					this.loadTargetMap(unk_map_buffer);
					this.character_definition = CharacterDefinition.load(cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer);
				};
				module$14.exports = UnknownDictionary;
			}, {
				"../util/ByteBuffer": 21,
				"./CharacterDefinition": 9,
				"./TokenInfoDictionary": 13
			}],
			15: [function(require, module$15, exports$16) {
				"use strict";
				var CharacterDefinition = require("../CharacterDefinition");
				var InvokeDefinitionMap = require("../InvokeDefinitionMap");
				var CATEGORY_DEF_PATTERN = /^(\w+)\s+(\d)\s+(\d)\s+(\d)/;
				var CATEGORY_MAPPING_PATTERN = /^(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/;
				var RANGE_CATEGORY_MAPPING_PATTERN = /^(0x[0-9A-F]{4})\.\.(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/;
				/**
				* CharacterDefinitionBuilder
				* @constructor
				*/
				function CharacterDefinitionBuilder() {
					this.char_def = new CharacterDefinition();
					this.char_def.invoke_definition_map = new InvokeDefinitionMap();
					this.character_category_definition = [];
					this.category_mapping = [];
				}
				CharacterDefinitionBuilder.prototype.putLine = function(line) {
					var parsed_category_def = CATEGORY_DEF_PATTERN.exec(line);
					if (parsed_category_def != null) {
						var class_id = this.character_category_definition.length;
						var char_class = CharacterDefinition.parseCharCategory(class_id, parsed_category_def);
						if (char_class == null) return;
						this.character_category_definition.push(char_class);
						return;
					}
					var parsed_category_mapping = CATEGORY_MAPPING_PATTERN.exec(line);
					if (parsed_category_mapping != null) {
						var mapping = CharacterDefinition.parseCategoryMapping(parsed_category_mapping);
						this.category_mapping.push(mapping);
					}
					var parsed_range_category_mapping = RANGE_CATEGORY_MAPPING_PATTERN.exec(line);
					if (parsed_range_category_mapping != null) {
						var range_mapping = CharacterDefinition.parseRangeCategoryMapping(parsed_range_category_mapping);
						this.category_mapping.push(range_mapping);
					}
				};
				CharacterDefinitionBuilder.prototype.build = function() {
					this.char_def.invoke_definition_map.init(this.character_category_definition);
					this.char_def.initCategoryMappings(this.category_mapping);
					return this.char_def;
				};
				module$15.exports = CharacterDefinitionBuilder;
			}, {
				"../CharacterDefinition": 9,
				"../InvokeDefinitionMap": 12
			}],
			16: [function(require, module$16, exports$17) {
				"use strict";
				var ConnectionCosts = require("../ConnectionCosts");
				/**
				* Builder class for constructing ConnectionCosts object
				* @constructor
				*/
				function ConnectionCostsBuilder() {
					this.lines = 0;
					this.connection_cost = null;
				}
				ConnectionCostsBuilder.prototype.putLine = function(line) {
					if (this.lines === 0) {
						var dimensions = line.split(" ");
						var forward_dimension = dimensions[0];
						var backward_dimension = dimensions[1];
						if (forward_dimension < 0 || backward_dimension < 0) throw "Parse error of matrix.def";
						this.connection_cost = new ConnectionCosts(forward_dimension, backward_dimension);
						this.lines++;
						return this;
					}
					var costs = line.split(" ");
					if (costs.length !== 3) return this;
					var forward_id = parseInt(costs[0]);
					var backward_id = parseInt(costs[1]);
					var cost = parseInt(costs[2]);
					if (forward_id < 0 || backward_id < 0 || !isFinite(forward_id) || !isFinite(backward_id) || this.connection_cost.forward_dimension <= forward_id || this.connection_cost.backward_dimension <= backward_id) throw "Parse error of matrix.def";
					this.connection_cost.put(forward_id, backward_id, cost);
					this.lines++;
					return this;
				};
				ConnectionCostsBuilder.prototype.build = function() {
					return this.connection_cost;
				};
				module$16.exports = ConnectionCostsBuilder;
			}, { "../ConnectionCosts": 10 }],
			17: [function(require, module$17, exports$18) {
				"use strict";
				var doublearray = require("doublearray");
				var DynamicDictionaries = require("../DynamicDictionaries");
				var TokenInfoDictionary = require("../TokenInfoDictionary");
				var ConnectionCostsBuilder = require("./ConnectionCostsBuilder");
				var CharacterDefinitionBuilder = require("./CharacterDefinitionBuilder");
				var UnknownDictionary = require("../UnknownDictionary");
				/**
				* Build dictionaries (token info, connection costs)
				*
				* Generates from matrix.def
				* cc.dat: Connection costs
				*
				* Generates from *.csv
				* dat.dat: Double array
				* tid.dat: Token info dictionary
				* tid_map.dat: targetMap
				* tid_pos.dat: posList (part of speech)
				*/
				function DictionaryBuilder() {
					this.tid_entries = [];
					this.unk_entries = [];
					this.cc_builder = new ConnectionCostsBuilder();
					this.cd_builder = new CharacterDefinitionBuilder();
				}
				DictionaryBuilder.prototype.addTokenInfoDictionary = function(line) {
					var new_entry = line.split(",");
					this.tid_entries.push(new_entry);
					return this;
				};
				/**
				* Put one line of "matrix.def" file for building ConnectionCosts object
				* @param {string} line is a line of "matrix.def"
				*/
				DictionaryBuilder.prototype.putCostMatrixLine = function(line) {
					this.cc_builder.putLine(line);
					return this;
				};
				DictionaryBuilder.prototype.putCharDefLine = function(line) {
					this.cd_builder.putLine(line);
					return this;
				};
				/**
				* Put one line of "unk.def" file for building UnknownDictionary object
				* @param {string} line is a line of "unk.def"
				*/
				DictionaryBuilder.prototype.putUnkDefLine = function(line) {
					this.unk_entries.push(line.split(","));
					return this;
				};
				DictionaryBuilder.prototype.build = function() {
					var dictionaries = this.buildTokenInfoDictionary();
					var unknown_dictionary = this.buildUnknownDictionary();
					return new DynamicDictionaries(dictionaries.trie, dictionaries.token_info_dictionary, this.cc_builder.build(), unknown_dictionary);
				};
				/**
				* Build TokenInfoDictionary
				*
				* @returns {{trie: *, token_info_dictionary: *}}
				*/
				DictionaryBuilder.prototype.buildTokenInfoDictionary = function() {
					var token_info_dictionary = new TokenInfoDictionary();
					var dictionary_entries = token_info_dictionary.buildDictionary(this.tid_entries);
					var trie = this.buildDoubleArray();
					for (var token_info_id in dictionary_entries) {
						var surface_form = dictionary_entries[token_info_id];
						var trie_id = trie.lookup(surface_form);
						token_info_dictionary.addMapping(trie_id, token_info_id);
					}
					return {
						trie,
						token_info_dictionary
					};
				};
				DictionaryBuilder.prototype.buildUnknownDictionary = function() {
					var unk_dictionary = new UnknownDictionary();
					var dictionary_entries = unk_dictionary.buildDictionary(this.unk_entries);
					var char_def = this.cd_builder.build();
					unk_dictionary.characterDefinition(char_def);
					for (var token_info_id in dictionary_entries) {
						var class_name = dictionary_entries[token_info_id];
						var class_id = char_def.invoke_definition_map.lookup(class_name);
						unk_dictionary.addMapping(class_id, token_info_id);
					}
					return unk_dictionary;
				};
				/**
				* Build double array trie
				*
				* @returns {DoubleArray} Double-Array trie
				*/
				DictionaryBuilder.prototype.buildDoubleArray = function() {
					var trie_id = 0;
					var words = this.tid_entries.map(function(entry) {
						return {
							k: entry[0],
							v: trie_id++
						};
					});
					return doublearray.builder(1024 * 1024).build(words);
				};
				module$17.exports = DictionaryBuilder;
			}, {
				"../DynamicDictionaries": 11,
				"../TokenInfoDictionary": 13,
				"../UnknownDictionary": 14,
				"./CharacterDefinitionBuilder": 15,
				"./ConnectionCostsBuilder": 16,
				"doublearray": 2
			}],
			18: [function(require, module$18, exports$19) {
				"use strict";
				var TokenizerBuilder = require("./TokenizerBuilder");
				var DictionaryBuilder = require("./dict/builder/DictionaryBuilder");
				module$18.exports = {
					builder: function(option) {
						return new TokenizerBuilder(option);
					},
					dictionaryBuilder: function() {
						return new DictionaryBuilder();
					}
				};
			}, {
				"./TokenizerBuilder": 7,
				"./dict/builder/DictionaryBuilder": 17
			}],
			19: [function(require, module$19, exports$20) {
				"use strict";
				var zlib = require("zlibjs/bin/gunzip.min.js");
				var DictionaryLoader = require("./DictionaryLoader");
				/**
				* BrowserDictionaryLoader inherits DictionaryLoader, using jQuery XHR for download
				* @param {string} dic_path Dictionary path
				* @constructor
				*/
				function BrowserDictionaryLoader(dic_path) {
					DictionaryLoader.apply(this, [dic_path]);
				}
				BrowserDictionaryLoader.prototype = Object.create(DictionaryLoader.prototype);
				/**
				* Utility function to load gzipped dictionary
				* @param {string} url Dictionary URL
				* @param {BrowserDictionaryLoader~onLoad} callback Callback function
				*/
				BrowserDictionaryLoader.prototype.loadArrayBuffer = function(url, callback) {
					var xhr = new XMLHttpRequest();
					xhr.open("GET", url, true);
					xhr.responseType = "arraybuffer";
					xhr.onload = function() {
						if (this.status > 0 && this.status !== 200) {
							callback(xhr.statusText, null);
							return;
						}
						var arraybuffer = this.response;
						callback(null, new zlib.Zlib.Gunzip(new Uint8Array(arraybuffer)).decompress().buffer);
					};
					xhr.onerror = function(err) {
						callback(err, null);
					};
					xhr.send();
				};
				/**
				* Callback
				* @callback BrowserDictionaryLoader~onLoad
				* @param {Object} err Error object
				* @param {Uint8Array} buffer Loaded buffer
				*/
				module$19.exports = BrowserDictionaryLoader;
			}, {
				"./DictionaryLoader": 20,
				"zlibjs/bin/gunzip.min.js": 5
			}],
			20: [function(require, module$20, exports$21) {
				"use strict";
				var path = require("path");
				var async = require("async");
				var DynamicDictionaries = require("../dict/DynamicDictionaries");
				/**
				* DictionaryLoader base constructor
				* @param {string} dic_path Dictionary path
				* @constructor
				*/
				function DictionaryLoader(dic_path) {
					this.dic = new DynamicDictionaries();
					this.dic_path = dic_path;
				}
				DictionaryLoader.prototype.loadArrayBuffer = function(file, callback) {
					throw new Error("DictionaryLoader#loadArrayBuffer should be overwrite");
				};
				/**
				* Load dictionary files
				* @param {DictionaryLoader~onLoad} load_callback Callback function called after loaded
				*/
				DictionaryLoader.prototype.load = function(load_callback) {
					var dic = this.dic;
					var dic_path = this.dic_path;
					var loadArrayBuffer = this.loadArrayBuffer;
					async.parallel([
						function(callback) {
							async.map(["base.dat.gz", "check.dat.gz"], function(filename, _callback) {
								loadArrayBuffer(path.join(dic_path, filename), function(err, buffer) {
									if (err) return _callback(err);
									_callback(null, buffer);
								});
							}, function(err, buffers) {
								if (err) return callback(err);
								var base_buffer = new Int32Array(buffers[0]);
								var check_buffer = new Int32Array(buffers[1]);
								dic.loadTrie(base_buffer, check_buffer);
								callback(null);
							});
						},
						function(callback) {
							async.map([
								"tid.dat.gz",
								"tid_pos.dat.gz",
								"tid_map.dat.gz"
							], function(filename, _callback) {
								loadArrayBuffer(path.join(dic_path, filename), function(err, buffer) {
									if (err) return _callback(err);
									_callback(null, buffer);
								});
							}, function(err, buffers) {
								if (err) return callback(err);
								var token_info_buffer = new Uint8Array(buffers[0]);
								var pos_buffer = new Uint8Array(buffers[1]);
								var target_map_buffer = new Uint8Array(buffers[2]);
								dic.loadTokenInfoDictionaries(token_info_buffer, pos_buffer, target_map_buffer);
								callback(null);
							});
						},
						function(callback) {
							loadArrayBuffer(path.join(dic_path, "cc.dat.gz"), function(err, buffer) {
								if (err) return callback(err);
								var cc_buffer = new Int16Array(buffer);
								dic.loadConnectionCosts(cc_buffer);
								callback(null);
							});
						},
						function(callback) {
							async.map([
								"unk.dat.gz",
								"unk_pos.dat.gz",
								"unk_map.dat.gz",
								"unk_char.dat.gz",
								"unk_compat.dat.gz",
								"unk_invoke.dat.gz"
							], function(filename, _callback) {
								loadArrayBuffer(path.join(dic_path, filename), function(err, buffer) {
									if (err) return _callback(err);
									_callback(null, buffer);
								});
							}, function(err, buffers) {
								if (err) return callback(err);
								var unk_buffer = new Uint8Array(buffers[0]);
								var unk_pos_buffer = new Uint8Array(buffers[1]);
								var unk_map_buffer = new Uint8Array(buffers[2]);
								var cat_map_buffer = new Uint8Array(buffers[3]);
								var compat_cat_map_buffer = new Uint32Array(buffers[4]);
								var invoke_def_buffer = new Uint8Array(buffers[5]);
								dic.loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer);
								callback(null);
							});
						}
					], function(err) {
						load_callback(err, dic);
					});
				};
				/**
				* Callback
				* @callback DictionaryLoader~onLoad
				* @param {Object} err Error object
				* @param {DynamicDictionaries} dic Loaded dictionary
				*/
				module$20.exports = DictionaryLoader;
			}, {
				"../dict/DynamicDictionaries": 11,
				"async": 1,
				"path": 3
			}],
			21: [function(require, module$21, exports$22) {
				"use strict";
				/**
				* Convert String (UTF-16) to UTF-8 ArrayBuffer
				*
				* @param {String} str UTF-16 string to convert
				* @return {Uint8Array} Byte sequence encoded by UTF-8
				*/
				var stringToUtf8Bytes = function(str) {
					var bytes = new Uint8Array(str.length * 4);
					var i = 0, j = 0;
					while (i < str.length) {
						var unicode_code;
						var utf16_code = str.charCodeAt(i++);
						if (utf16_code >= 55296 && utf16_code <= 56319) {
							var upper = utf16_code;
							var lower = str.charCodeAt(i++);
							if (lower >= 56320 && lower <= 57343) unicode_code = (upper - 55296) * 1024 + 65536 + (lower - 56320);
							else return null;
						} else unicode_code = utf16_code;
						if (unicode_code < 128) bytes[j++] = unicode_code;
						else if (unicode_code < 2048) {
							bytes[j++] = unicode_code >>> 6 | 192;
							bytes[j++] = unicode_code & 63 | 128;
						} else if (unicode_code < 65536) {
							bytes[j++] = unicode_code >>> 12 | 224;
							bytes[j++] = unicode_code >> 6 & 63 | 128;
							bytes[j++] = unicode_code & 63 | 128;
						} else if (unicode_code < 1 << 21) {
							bytes[j++] = unicode_code >>> 18 | 240;
							bytes[j++] = unicode_code >> 12 & 63 | 128;
							bytes[j++] = unicode_code >> 6 & 63 | 128;
							bytes[j++] = unicode_code & 63 | 128;
						}
					}
					return bytes.subarray(0, j);
				};
				/**
				* Convert UTF-8 ArrayBuffer to String (UTF-16)
				*
				* @param {Array} bytes UTF-8 byte sequence to convert
				* @return {String} String encoded by UTF-16
				*/
				var utf8BytesToString = function(bytes) {
					var str = "";
					var code, b1, b2, b3, b4, upper, lower;
					var i = 0;
					while (i < bytes.length) {
						b1 = bytes[i++];
						if (b1 < 128) code = b1;
						else if (b1 >> 5 === 6) {
							b2 = bytes[i++];
							code = (b1 & 31) << 6 | b2 & 63;
						} else if (b1 >> 4 === 14) {
							b2 = bytes[i++];
							b3 = bytes[i++];
							code = (b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63;
						} else {
							b2 = bytes[i++];
							b3 = bytes[i++];
							b4 = bytes[i++];
							code = (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63;
						}
						if (code < 65536) str += String.fromCharCode(code);
						else {
							code -= 65536;
							upper = 55296 | code >> 10;
							lower = 56320 | code & 1023;
							str += String.fromCharCode(upper, lower);
						}
					}
					return str;
				};
				/**
				* Utilities to manipulate byte sequence
				* @param {(number|Uint8Array)} arg Initial size of this buffer (number), or buffer to set (Uint8Array)
				* @constructor
				*/
				function ByteBuffer(arg) {
					var initial_size;
					if (arg == null) initial_size = 1024 * 1024;
					else if (typeof arg === "number") initial_size = arg;
					else if (arg instanceof Uint8Array) {
						this.buffer = arg;
						this.position = 0;
						return;
					} else throw typeof arg + " is invalid parameter type for ByteBuffer constructor";
					this.buffer = new Uint8Array(initial_size);
					this.position = 0;
				}
				ByteBuffer.prototype.size = function() {
					return this.buffer.length;
				};
				ByteBuffer.prototype.reallocate = function() {
					var new_array = new Uint8Array(this.buffer.length * 2);
					new_array.set(this.buffer);
					this.buffer = new_array;
				};
				ByteBuffer.prototype.shrink = function() {
					this.buffer = this.buffer.subarray(0, this.position);
					return this.buffer;
				};
				ByteBuffer.prototype.put = function(b) {
					if (this.buffer.length < this.position + 1) this.reallocate();
					this.buffer[this.position++] = b;
				};
				ByteBuffer.prototype.get = function(index) {
					if (index == null) {
						index = this.position;
						this.position += 1;
					}
					if (this.buffer.length < index + 1) return 0;
					return this.buffer[index];
				};
				ByteBuffer.prototype.putShort = function(num) {
					if (65535 < num) throw num + " is over short value";
					var lower = 255 & num;
					var upper = (65280 & num) >> 8;
					this.put(lower);
					this.put(upper);
				};
				ByteBuffer.prototype.getShort = function(index) {
					if (index == null) {
						index = this.position;
						this.position += 2;
					}
					if (this.buffer.length < index + 2) return 0;
					var lower = this.buffer[index];
					var value = (this.buffer[index + 1] << 8) + lower;
					if (value & 32768) value = -(value - 1 ^ 65535);
					return value;
				};
				ByteBuffer.prototype.putInt = function(num) {
					if (4294967295 < num) throw num + " is over integer value";
					var b0 = 255 & num;
					var b1 = (65280 & num) >> 8;
					var b2 = (16711680 & num) >> 16;
					var b3 = (4278190080 & num) >> 24;
					this.put(b0);
					this.put(b1);
					this.put(b2);
					this.put(b3);
				};
				ByteBuffer.prototype.getInt = function(index) {
					if (index == null) {
						index = this.position;
						this.position += 4;
					}
					if (this.buffer.length < index + 4) return 0;
					var b0 = this.buffer[index];
					var b1 = this.buffer[index + 1];
					var b2 = this.buffer[index + 2];
					return (this.buffer[index + 3] << 24) + (b2 << 16) + (b1 << 8) + b0;
				};
				ByteBuffer.prototype.readInt = function() {
					var pos = this.position;
					this.position += 4;
					return this.getInt(pos);
				};
				ByteBuffer.prototype.putString = function(str) {
					var bytes = stringToUtf8Bytes(str);
					for (var i = 0; i < bytes.length; i++) this.put(bytes[i]);
					this.put(0);
				};
				ByteBuffer.prototype.getString = function(index) {
					var buf = [], ch;
					if (index == null) index = this.position;
					while (true) {
						if (this.buffer.length < index + 1) break;
						ch = this.get(index++);
						if (ch === 0) break;
						else buf.push(ch);
					}
					this.position = index;
					return utf8BytesToString(buf);
				};
				module$21.exports = ByteBuffer;
			}, {}],
			22: [function(require, module$22, exports$23) {
				"use strict";
				/**
				* Mappings between IPADIC dictionary features and tokenized results
				* @constructor
				*/
				function IpadicFormatter() {}
				IpadicFormatter.prototype.formatEntry = function(word_id, position, type, features) {
					var token = {};
					token.word_id = word_id;
					token.word_type = type;
					token.word_position = position;
					token.surface_form = features[0];
					token.pos = features[1];
					token.pos_detail_1 = features[2];
					token.pos_detail_2 = features[3];
					token.pos_detail_3 = features[4];
					token.conjugated_type = features[5];
					token.conjugated_form = features[6];
					token.basic_form = features[7];
					token.reading = features[8];
					token.pronunciation = features[9];
					return token;
				};
				IpadicFormatter.prototype.formatUnknownEntry = function(word_id, position, type, features, surface_form) {
					var token = {};
					token.word_id = word_id;
					token.word_type = type;
					token.word_position = position;
					token.surface_form = surface_form;
					token.pos = features[1];
					token.pos_detail_1 = features[2];
					token.pos_detail_2 = features[3];
					token.pos_detail_3 = features[4];
					token.conjugated_type = features[5];
					token.conjugated_form = features[6];
					token.basic_form = features[7];
					return token;
				};
				module$22.exports = IpadicFormatter;
			}, {}],
			23: [function(require, module$23, exports$24) {
				"use strict";
				/**
				* String wrapper for UTF-16 surrogate pair (4 bytes)
				* @param {string} str String to wrap
				* @constructor
				*/
				function SurrogateAwareString(str) {
					this.str = str;
					this.index_mapping = [];
					for (var pos = 0; pos < str.length; pos++) {
						var ch = str.charAt(pos);
						this.index_mapping.push(pos);
						if (SurrogateAwareString.isSurrogatePair(ch)) pos++;
					}
					this.length = this.index_mapping.length;
				}
				SurrogateAwareString.prototype.slice = function(index) {
					if (this.index_mapping.length <= index) return "";
					var surrogate_aware_index = this.index_mapping[index];
					return this.str.slice(surrogate_aware_index);
				};
				SurrogateAwareString.prototype.charAt = function(index) {
					if (this.str.length <= index) return "";
					var surrogate_aware_start_index = this.index_mapping[index];
					var surrogate_aware_end_index = this.index_mapping[index + 1];
					if (surrogate_aware_end_index == null) return this.str.slice(surrogate_aware_start_index);
					return this.str.slice(surrogate_aware_start_index, surrogate_aware_end_index);
				};
				SurrogateAwareString.prototype.charCodeAt = function(index) {
					if (this.index_mapping.length <= index) return NaN;
					var surrogate_aware_index = this.index_mapping[index];
					var upper = this.str.charCodeAt(surrogate_aware_index);
					var lower;
					if (upper >= 55296 && upper <= 56319 && surrogate_aware_index < this.str.length) {
						lower = this.str.charCodeAt(surrogate_aware_index + 1);
						if (lower >= 56320 && lower <= 57343) return (upper - 55296) * 1024 + lower - 56320 + 65536;
					}
					return upper;
				};
				SurrogateAwareString.prototype.toString = function() {
					return this.str;
				};
				SurrogateAwareString.isSurrogatePair = function(ch) {
					var utf16_code = ch.charCodeAt(0);
					if (utf16_code >= 55296 && utf16_code <= 56319) return true;
					else return false;
				};
				module$23.exports = SurrogateAwareString;
			}, {}],
			24: [function(require, module$24, exports$25) {
				"use strict";
				var ViterbiNode = require("./ViterbiNode");
				var ViterbiLattice = require("./ViterbiLattice");
				var SurrogateAwareString = require("../util/SurrogateAwareString");
				/**
				* ViterbiBuilder builds word lattice (ViterbiLattice)
				* @param {DynamicDictionaries} dic dictionary
				* @constructor
				*/
				function ViterbiBuilder(dic) {
					this.trie = dic.trie;
					this.token_info_dictionary = dic.token_info_dictionary;
					this.unknown_dictionary = dic.unknown_dictionary;
				}
				/**
				* Build word lattice
				* @param {string} sentence_str Input text
				* @returns {ViterbiLattice} Word lattice
				*/
				ViterbiBuilder.prototype.build = function(sentence_str) {
					var lattice = new ViterbiLattice();
					var sentence = new SurrogateAwareString(sentence_str);
					var key, trie_id, left_id, right_id, word_cost;
					for (var pos = 0; pos < sentence.length; pos++) {
						var tail = sentence.slice(pos);
						var vocabulary = this.trie.commonPrefixSearch(tail);
						for (var n = 0; n < vocabulary.length; n++) {
							trie_id = vocabulary[n].v;
							key = vocabulary[n].k;
							var token_info_ids = this.token_info_dictionary.target_map[trie_id];
							for (var i = 0; i < token_info_ids.length; i++) {
								var token_info_id = parseInt(token_info_ids[i]);
								left_id = this.token_info_dictionary.dictionary.getShort(token_info_id);
								right_id = this.token_info_dictionary.dictionary.getShort(token_info_id + 2);
								word_cost = this.token_info_dictionary.dictionary.getShort(token_info_id + 4);
								lattice.append(new ViterbiNode(token_info_id, word_cost, pos + 1, key.length, "KNOWN", left_id, right_id, key));
							}
						}
						var surrogate_aware_tail = new SurrogateAwareString(tail);
						var head_char = new SurrogateAwareString(surrogate_aware_tail.charAt(0));
						var head_char_class = this.unknown_dictionary.lookup(head_char.toString());
						if (vocabulary == null || vocabulary.length === 0 || head_char_class.is_always_invoke === 1) {
							key = head_char;
							if (head_char_class.is_grouping === 1 && 1 < surrogate_aware_tail.length) for (var k = 1; k < surrogate_aware_tail.length; k++) {
								var next_char = surrogate_aware_tail.charAt(k);
								var next_char_class = this.unknown_dictionary.lookup(next_char);
								if (head_char_class.class_name !== next_char_class.class_name) break;
								key += next_char;
							}
							var unk_ids = this.unknown_dictionary.target_map[head_char_class.class_id];
							for (var j = 0; j < unk_ids.length; j++) {
								var unk_id = parseInt(unk_ids[j]);
								left_id = this.unknown_dictionary.dictionary.getShort(unk_id);
								right_id = this.unknown_dictionary.dictionary.getShort(unk_id + 2);
								word_cost = this.unknown_dictionary.dictionary.getShort(unk_id + 4);
								lattice.append(new ViterbiNode(unk_id, word_cost, pos + 1, key.length, "UNKNOWN", left_id, right_id, key.toString()));
							}
						}
					}
					lattice.appendEos();
					return lattice;
				};
				module$24.exports = ViterbiBuilder;
			}, {
				"../util/SurrogateAwareString": 23,
				"./ViterbiLattice": 25,
				"./ViterbiNode": 26
			}],
			25: [function(require, module$25, exports$26) {
				"use strict";
				var ViterbiNode = require("./ViterbiNode");
				/**
				* ViterbiLattice is a lattice in Viterbi algorithm
				* @constructor
				*/
				function ViterbiLattice() {
					this.nodes_end_at = [];
					this.nodes_end_at[0] = [new ViterbiNode(-1, 0, 0, 0, "BOS", 0, 0, "")];
					this.eos_pos = 1;
				}
				/**
				* Append node to ViterbiLattice
				* @param {ViterbiNode} node
				*/
				ViterbiLattice.prototype.append = function(node) {
					var last_pos = node.start_pos + node.length - 1;
					if (this.eos_pos < last_pos) this.eos_pos = last_pos;
					var prev_nodes = this.nodes_end_at[last_pos];
					if (prev_nodes == null) prev_nodes = [];
					prev_nodes.push(node);
					this.nodes_end_at[last_pos] = prev_nodes;
				};
				/**
				* Set ends with EOS (End of Statement)
				*/
				ViterbiLattice.prototype.appendEos = function() {
					var last_index = this.nodes_end_at.length;
					this.eos_pos++;
					this.nodes_end_at[last_index] = [new ViterbiNode(-1, 0, this.eos_pos, 0, "EOS", 0, 0, "")];
				};
				module$25.exports = ViterbiLattice;
			}, { "./ViterbiNode": 26 }],
			26: [function(require, module$26, exports$27) {
				"use strict";
				/**
				* ViterbiNode is a node of ViterbiLattice
				* @param {number} node_name Word ID
				* @param {number} node_cost Word cost to generate
				* @param {number} start_pos Start position from 1
				* @param {number} length Word length
				* @param {string} type Node type (KNOWN, UNKNOWN, BOS, EOS, ...)
				* @param {number} left_id Left context ID
				* @param {number} right_id Right context ID
				* @param {string} surface_form Surface form of this word
				* @constructor
				*/
				function ViterbiNode(node_name, node_cost, start_pos, length, type, left_id, right_id, surface_form) {
					this.name = node_name;
					this.cost = node_cost;
					this.start_pos = start_pos;
					this.length = length;
					this.left_id = left_id;
					this.right_id = right_id;
					this.prev = null;
					this.surface_form = surface_form;
					if (type === "BOS") this.shortest_cost = 0;
					else this.shortest_cost = Number.MAX_VALUE;
					this.type = type;
				}
				module$26.exports = ViterbiNode;
			}, {}],
			27: [function(require, module$27, exports$28) {
				"use strict";
				/**
				* ViterbiSearcher is for searching best Viterbi path
				* @param {ConnectionCosts} connection_costs Connection costs matrix
				* @constructor
				*/
				function ViterbiSearcher(connection_costs) {
					this.connection_costs = connection_costs;
				}
				/**
				* Search best path by forward-backward algorithm
				* @param {ViterbiLattice} lattice Viterbi lattice to search
				* @returns {Array} Shortest path
				*/
				ViterbiSearcher.prototype.search = function(lattice) {
					lattice = this.forward(lattice);
					return this.backward(lattice);
				};
				ViterbiSearcher.prototype.forward = function(lattice) {
					var i, j, k;
					for (i = 1; i <= lattice.eos_pos; i++) {
						var nodes = lattice.nodes_end_at[i];
						if (nodes == null) continue;
						for (j = 0; j < nodes.length; j++) {
							var node = nodes[j];
							var cost = Number.MAX_VALUE;
							var shortest_prev_node;
							var prev_nodes = lattice.nodes_end_at[node.start_pos - 1];
							if (prev_nodes == null) continue;
							for (k = 0; k < prev_nodes.length; k++) {
								var prev_node = prev_nodes[k];
								var edge_cost;
								if (node.left_id == null || prev_node.right_id == null) {
									console.log("Left or right is null");
									edge_cost = 0;
								} else edge_cost = this.connection_costs.get(prev_node.right_id, node.left_id);
								var _cost = prev_node.shortest_cost + edge_cost + node.cost;
								if (_cost < cost) {
									shortest_prev_node = prev_node;
									cost = _cost;
								}
							}
							node.prev = shortest_prev_node;
							node.shortest_cost = cost;
						}
					}
					return lattice;
				};
				ViterbiSearcher.prototype.backward = function(lattice) {
					var shortest_path = [];
					var node_back = lattice.nodes_end_at[lattice.nodes_end_at.length - 1][0].prev;
					if (node_back == null) return [];
					while (node_back.type !== "BOS") {
						shortest_path.push(node_back);
						if (node_back.prev == null) return [];
						node_back = node_back.prev;
					}
					return shortest_path.reverse();
				};
				module$27.exports = ViterbiSearcher;
			}, {}]
		}, {}, [18])(18);
	});
})))(), 1);
var tokenizerPromise = null;
async function getKuromojiTokenizer() {
	tokenizerPromise ??= new Promise((resolve, reject) => {
		import_kuromoji.default.builder({ dicPath: "/dicts" }).build((err, tokenizer) => {
			if (err) {
				tokenizerPromise = null;
				reject(err);
				return;
			}
			if (!tokenizer) {
				tokenizerPromise = null;
				reject(/* @__PURE__ */ new Error("Failed to initialize the tokenizer."));
				return;
			}
			resolve(tokenizer);
		});
	});
	return await tokenizerPromise;
}
//#endregion
//#region src/components/crok/ChatInput.tsx
function highlightMatchByTokens(text, queryTokens) {
	if (queryTokens.length === 0) return text;
	const lowerText = text.toLowerCase();
	const ranges = [];
	for (const token of queryTokens) {
		let pos = 0;
		while (pos < lowerText.length) {
			const index = lowerText.indexOf(token, pos);
			if (index === -1) break;
			ranges.push({
				start: index,
				end: index + token.length
			});
			pos = index + 1;
		}
	}
	if (ranges.length === 0) return text;
	ranges.sort((a, b) => a.start - b.start);
	const merged = [ranges[0]];
	for (let i = 1; i < ranges.length; i++) {
		const prev = merged[merged.length - 1];
		const curr = ranges[i];
		if (curr.start <= prev.end) prev.end = Math.max(prev.end, curr.end);
		else merged.push(curr);
	}
	const parts = [];
	let lastEnd = 0;
	for (let i = 0; i < merged.length; i++) {
		const range = merged[i];
		if (range.start > lastEnd) parts.push(text.slice(lastEnd, range.start));
		parts.push(/* @__PURE__ */ jsx("span", {
			className: "bg-cax-highlight text-cax-highlight-ink",
			children: text.slice(range.start, range.end)
		}, i));
		lastEnd = range.end;
	}
	if (lastEnd < text.length) parts.push(text.slice(lastEnd));
	return /* @__PURE__ */ jsx(Fragment, { children: parts });
}
var ChatInput = ({ isStreaming, onSendMessage }) => {
	const textareaRef = useRef(null);
	const suggestionsRef = useRef(null);
	const [tokenizer, setTokenizer] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [queryTokens, setQueryTokens] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	useLayoutEffect(() => {
		if (suggestionsRef.current && showSuggestions) suggestionsRef.current.scrollTop = suggestionsRef.current.scrollHeight;
	}, [suggestions, showSuggestions]);
	useEffect(() => {
		let mounted = true;
		const init = async () => {
			const nextTokenizer = await getKuromojiTokenizer();
			if (mounted) setTokenizer(nextTokenizer);
		};
		init();
		return () => {
			mounted = false;
		};
	}, []);
	useEffect(() => {
		let cancelled = false;
		const updateSuggestions = async () => {
			if (!tokenizer || !inputValue.trim()) {
				setSuggestions([]);
				setQueryTokens([]);
				setShowSuggestions(false);
				return;
			}
			const { suggestions: candidates } = await fetchJSON("/api/v1/crok/suggestions");
			if (cancelled) return;
			const tokens = extractTokens(tokenizer.tokenize(inputValue));
			const results = filterSuggestionsBM25(tokenizer, candidates, tokens);
			if (cancelled) return;
			setQueryTokens(tokens);
			setSuggestions(results);
			setShowSuggestions(results.length > 0);
		};
		updateSuggestions();
		return () => {
			cancelled = true;
		};
	}, [inputValue, tokenizer]);
	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
		}
	};
	const resetTextareaHeight = () => {
		if (textareaRef.current) textareaRef.current.style.height = "auto";
	};
	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);
		adjustTextareaHeight();
	};
	const handleSuggestionClick = (suggestion) => {
		setInputValue(suggestion);
		setSuggestions([]);
		setQueryTokens([]);
		setShowSuggestions(false);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (inputValue.trim() && !isStreaming) {
			onSendMessage(inputValue.trim());
			setInputValue("");
			setSuggestions([]);
			setQueryTokens([]);
			setShowSuggestions(false);
			resetTextareaHeight();
		}
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
			e.preventDefault();
			handleSubmit(e);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "border-cax-border bg-cax-surface sticky bottom-12 border-t px-4 py-4 lg:bottom-0",
		children: /* @__PURE__ */ jsxs("form", {
			className: "relative mx-auto max-w-2xl",
			onSubmit: handleSubmit,
			children: [
				showSuggestions && suggestions.length > 0 && /* @__PURE__ */ jsx("div", {
					ref: suggestionsRef,
					className: "border-cax-border bg-cax-surface absolute right-0 bottom-full left-0 z-10 mb-2 max-h-[30vh] overflow-y-auto rounded-lg border shadow-lg",
					role: "listbox",
					"aria-label": "サジェスト候補",
					children: suggestions.map((suggestion, index) => /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "border-cax-border text-cax-text-muted hover:bg-cax-surface-subtle w-full border-b px-4 py-2 text-left text-sm last:border-b-0",
						onClick: () => handleSuggestionClick(suggestion),
						children: highlightMatchByTokens(suggestion, queryTokens)
					}, index))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-cax-border bg-cax-surface-subtle focus-within:border-cax-brand-strong relative flex items-end rounded-2xl border transition-colors",
					children: [/* @__PURE__ */ jsx("textarea", {
						ref: textareaRef,
						className: "text-cax-text placeholder-cax-text-subtle max-h-[200px] min-h-[52px] flex-1 resize-none overflow-y-auto bg-transparent py-3 pr-2 pl-4 focus:outline-none",
						onChange: handleInputChange,
						onKeyDown: handleKeyDown,
						placeholder: "メッセージを入力...",
						lang: "ja",
						rows: 1,
						value: inputValue
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-end pr-[6px] pb-[6px]",
						children: /* @__PURE__ */ jsx("button", {
							"aria-label": "送信",
							className: "bg-cax-brand text-cax-surface-raised hover:bg-cax-brand-strong disabled:bg-cax-surface-subtle shrink-0 rounded-xl p-2.5 transition-colors disabled:cursor-not-allowed",
							disabled: isStreaming || !inputValue.trim(),
							type: "submit",
							children: /* @__PURE__ */ jsx("span", {
								className: "flex h-5 w-5 items-center justify-center",
								children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
									iconType: "arrow-right",
									styleType: "solid"
								})
							})
						})
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-cax-text-subtle mt-2 text-center text-xs",
					children: isStreaming ? "AIが応答を生成中..." : "Crok AIは間違いを起こす可能性があります。"
				})
			]
		})
	});
};
//#endregion
//#region src/components/crok/CodeBlock.tsx
var CUSTOM_STYLE = {
	fontSize: "14px",
	padding: "24px 16px",
	borderRadius: "8px",
	border: "1px solid var(--color-cax-border)"
};
var highlighterPromise = null;
var normalizeLanguage = (language) => {
	switch (language) {
		case "js": return "javascript";
		case "ts": return "typescript";
		case "tsx": return "tsx";
		case "jsx": return "jsx";
		case "sh": return "bash";
		case "html": return "xml";
		case "md": return "markdown";
		case "yml": return "yaml";
		default: return language;
	}
};
var loadHighlighter = () => {
	highlighterPromise ??= Promise.all([
		import("./assets/light-CC7PBrXo.js"),
		import("./assets/atom-one-light-DzwU3rSZ.js"),
		import("./assets/bash-CcPB8aCp.js"),
		import("./assets/css-iYcUB47i.js"),
		import("./assets/diff-C2kZenM6.js"),
		import("./assets/javascript-BDDp70aZ.js"),
		import("./assets/json-M_JfYcOw.js"),
		import("./assets/markdown-DMKVRrwR.js"),
		import("./assets/plaintext-BpTTKJrc.js"),
		import("./assets/python-BrXNWDJR.js"),
		import("./assets/sql-DGhrgeWp.js"),
		import("./assets/typescript-B42zqfRM.js"),
		import("./assets/xml-BWz3dvur.js"),
		import("./assets/yaml-CatZKYds.js")
	]).then(([{ default: LightSyntaxHighlighter }, { default: atomOneLight }, { default: bash }, { default: css }, { default: diff }, { default: javascript }, { default: json }, { default: markdown }, { default: plaintext }, { default: python }, { default: sql }, { default: typescript }, { default: xml }, { default: yaml }]) => {
		LightSyntaxHighlighter.registerLanguage("bash", bash);
		LightSyntaxHighlighter.registerLanguage("css", css);
		LightSyntaxHighlighter.registerLanguage("diff", diff);
		LightSyntaxHighlighter.registerLanguage("javascript", javascript);
		LightSyntaxHighlighter.registerLanguage("json", json);
		LightSyntaxHighlighter.registerLanguage("jsx", javascript);
		LightSyntaxHighlighter.registerLanguage("markdown", markdown);
		LightSyntaxHighlighter.registerLanguage("plaintext", plaintext);
		LightSyntaxHighlighter.registerLanguage("python", python);
		LightSyntaxHighlighter.registerLanguage("sql", sql);
		LightSyntaxHighlighter.registerLanguage("typescript", typescript);
		LightSyntaxHighlighter.registerLanguage("tsx", typescript);
		LightSyntaxHighlighter.registerLanguage("xml", xml);
		LightSyntaxHighlighter.registerLanguage("yaml", yaml);
		return {
			SyntaxHighlighter: LightSyntaxHighlighter,
			style: atomOneLight
		};
	});
	return highlighterPromise;
};
var getLanguage = (children) => {
	const className = children.props.className;
	if (typeof className === "string") return normalizeLanguage(className.match(/language-(\w+)/)?.[1] ?? "javascript");
	return "javascript";
};
var isCodeElement = (children) => isValidElement(children) && children.type === "code";
var CodeBlock = ({ children }) => {
	if (!isCodeElement(children)) return /* @__PURE__ */ jsx(Fragment, { children });
	const language = getLanguage(children);
	const code = children.props.children?.toString() ?? "";
	const [loadedHighlighter, setLoadedHighlighter] = useState(null);
	useEffect(() => {
		let isMounted = true;
		loadHighlighter().then((highlighter) => {
			if (isMounted) setLoadedHighlighter(highlighter);
		});
		return () => {
			isMounted = false;
		};
	}, []);
	if (loadedHighlighter == null) return /* @__PURE__ */ jsx("pre", {
		style: CUSTOM_STYLE,
		children: /* @__PURE__ */ jsx("code", { children: code })
	});
	const { SyntaxHighlighter, style } = loadedHighlighter;
	return /* @__PURE__ */ jsx(SyntaxHighlighter, {
		customStyle: CUSTOM_STYLE,
		language,
		style,
		children: code
	});
};
//#endregion
//#region src/components/crok/TypingIndicator.tsx
var TypingIndicator = () => {
	return /* @__PURE__ */ jsxs("div", {
		"aria-label": "応答中",
		className: "flex items-center gap-1",
		role: "status",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "bg-cax-border h-2 w-2 animate-bounce rounded-full",
				style: { animationDelay: "0ms" }
			}),
			/* @__PURE__ */ jsx("span", {
				className: "bg-cax-border h-2 w-2 animate-bounce rounded-full",
				style: { animationDelay: "150ms" }
			}),
			/* @__PURE__ */ jsx("span", {
				className: "bg-cax-border h-2 w-2 animate-bounce rounded-full",
				style: { animationDelay: "300ms" }
			})
		]
	});
};
//#endregion
//#region src/components/crok/ChatMessage.tsx
var loadMathPlugins = () => import("./assets/load_math_plugins-tF9hX-9Z.js");
var hasMathSyntax = (content) => {
	return /(^|[^\\])\$\$[\s\S]+?\$\$/m.test(content) || /(^|[^\\])\$[^$\n]+\$/m.test(content) || /\\\([\s\S]+?\\\)/.test(content) || /\\\[[\s\S]+?\\\]/.test(content) || /\\begin\{[a-zA-Z*]+\}/.test(content);
};
var UserMessage = ({ content }) => {
	return /* @__PURE__ */ jsx("div", {
		className: "mb-6 flex justify-end",
		children: /* @__PURE__ */ jsx("div", {
			className: "bg-cax-surface-subtle text-cax-text max-w-[80%] rounded-3xl px-4 py-2",
			children: /* @__PURE__ */ jsx("p", {
				className: "whitespace-pre-wrap",
				children: content
			})
		})
	});
};
var AssistantMessage = ({ content }) => {
	const [mathPlugins, setMathPlugins] = useState(null);
	const shouldLoadMath = hasMathSyntax(content);
	useEffect(() => {
		if (!shouldLoadMath) return;
		let isMounted = true;
		loadMathPlugins().then((plugins) => {
			if (isMounted) setMathPlugins(plugins);
		});
		return () => {
			isMounted = false;
		};
	}, [shouldLoadMath]);
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-6 flex gap-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "h-8 w-8 shrink-0",
			children: /* @__PURE__ */ jsx(CrokLogo, { className: "h-full w-full" })
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-cax-text mb-1 text-sm font-medium",
				children: "Crok"
			}), /* @__PURE__ */ jsx("div", {
				className: "markdown text-cax-text max-w-none",
				children: content ? /* @__PURE__ */ jsx(Markdown, {
					components: { pre: CodeBlock },
					rehypePlugins: shouldLoadMath && mathPlugins ? [mathPlugins.rehypeKatex] : [],
					remarkPlugins: shouldLoadMath && mathPlugins ? [mathPlugins.remarkMath, remarkGfm] : [remarkGfm],
					children: content
				}, content) : /* @__PURE__ */ jsx(TypingIndicator, {})
			})]
		})]
	});
};
var ChatMessage = ({ message }) => {
	if (message.role === "user") return /* @__PURE__ */ jsx(UserMessage, { content: message.content });
	return /* @__PURE__ */ jsx(AssistantMessage, { content: message.content });
};
//#endregion
//#region src/components/crok/WelcomeScreen.tsx
var WelcomeScreen = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mb-6 h-20 w-20",
				children: /* @__PURE__ */ jsx(CrokLogo, { className: "h-full w-full" })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "text-cax-text mb-2 text-2xl font-bold",
				children: "Crok AI"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-cax-text-muted mb-8",
				children: "AIアシスタントに質問してみましょう"
			})
		]
	});
};
//#endregion
//#region src/hooks/use_has_content_below.ts
/**
* contentEndRef の要素が boundaryRef の要素より下にあるかを監視する。
* 例: コンテンツ末尾がスティッキーバーより下にあるとき true を返す。
*
* @param contentEndRef - コンテンツの末尾を示す要素の ref
* @param boundaryRef - 比較対象となる境界要素の ref（例: sticky な入力欄）
*/
function useHasContentBelow(contentEndRef, boundaryRef) {
	const [hasContentBelow, setHasContentBelow] = useState(false);
	useEffect(() => {
		let frameId = 0;
		const update = () => {
			frameId = 0;
			const endEl = contentEndRef.current;
			const barEl = boundaryRef.current;
			if (endEl && barEl) {
				const endRect = endEl.getBoundingClientRect();
				const barRect = barEl.getBoundingClientRect();
				const next = endRect.top > barRect.top;
				setHasContentBelow((current) => current === next ? current : next);
			}
		};
		const scheduleUpdate = () => {
			if (frameId !== 0) return;
			frameId = window.requestAnimationFrame(update);
		};
		scheduleUpdate();
		window.addEventListener("scroll", scheduleUpdate, { passive: true });
		window.addEventListener("resize", scheduleUpdate, { passive: true });
		const resizeObserver = new ResizeObserver(scheduleUpdate);
		resizeObserver.observe(document.body);
		if (contentEndRef.current) resizeObserver.observe(contentEndRef.current);
		if (boundaryRef.current) resizeObserver.observe(boundaryRef.current);
		return () => {
			window.removeEventListener("scroll", scheduleUpdate);
			window.removeEventListener("resize", scheduleUpdate);
			resizeObserver.disconnect();
			if (frameId !== 0) window.cancelAnimationFrame(frameId);
		};
	}, [contentEndRef, boundaryRef]);
	return hasContentBelow;
}
//#endregion
//#region src/components/crok/CrokPage.tsx
var CrokPage = ({ messages, isStreaming, onSendMessage }) => {
	const messagesEndRef = useRef(null);
	const stickyBarRef = useRef(null);
	const showScrollButton = useHasContentBelow(messagesEndRef, stickyBarRef);
	const handleScrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-cax-surface flex min-h-[calc(100vh-(--spacing(12)))] flex-col lg:min-h-screen",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex-1",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-2xl px-4 py-8",
				children: [
					messages.length === 0 && /* @__PURE__ */ jsx(WelcomeScreen, {}),
					messages.map((message) => /* @__PURE__ */ jsx(ChatMessage, { message }, message.id)),
					/* @__PURE__ */ jsx("div", { ref: messagesEndRef })
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			ref: stickyBarRef,
			className: "sticky bottom-12 lg:bottom-0",
			children: [showScrollButton && /* @__PURE__ */ jsx("button", {
				className: "border-cax-border bg-cax-surface hover:bg-cax-surface-subtle absolute -top-10 left-1/2 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border shadow-md transition-colors",
				onClick: handleScrollToBottom,
				type: "button",
				children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
					iconType: "arrow-down",
					styleType: "solid"
				})
			}), /* @__PURE__ */ jsx(ChatInput, {
				isStreaming,
				onSendMessage
			})]
		})]
	});
};
//#endregion
//#region src/hooks/use_sse.ts
function useSSE(options) {
	const [content, setContent] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const eventSourceRef = useRef(null);
	const contentRef = useRef("");
	const stop = useCallback(() => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
		}
		setIsStreaming(false);
	}, []);
	const reset = useCallback(() => {
		stop();
		setContent("");
		contentRef.current = "";
	}, [stop]);
	return {
		content,
		isStreaming,
		start: useCallback((url) => {
			stop();
			contentRef.current = "";
			setContent("");
			setIsStreaming(true);
			const eventSource = new EventSource(url);
			eventSourceRef.current = eventSource;
			eventSource.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (options.onDone?.(data) ?? false) {
					options.onComplete?.(contentRef.current);
					stop();
					return;
				}
				const newContent = options.onMessage(data, contentRef.current);
				contentRef.current = newContent;
				setContent(newContent);
			};
			eventSource.onerror = (error) => {
				console.error("SSE Error:", error);
				stop();
			};
		}, [options, stop]),
		stop,
		reset
	};
}
//#endregion
//#region src/containers/CrokContainer.tsx
var CrokContainer = ({ activeUser, authModalId }) => {
	const [messages, setMessages] = useState([]);
	const { content, isStreaming, start } = useSSE(useMemo(() => ({
		onMessage: (data, prevContent) => {
			return prevContent + (data.text ?? "");
		},
		onDone: (data) => data.done === true,
		onComplete: (finalContent) => {
			setMessages((prev) => {
				const lastMessage = prev[prev.length - 1];
				if (lastMessage?.role === "assistant") return [...prev.slice(0, -1), {
					...lastMessage,
					content: finalContent
				}];
				return prev;
			});
		}
	}), []));
	const currentAssistantContent = isStreaming || content ? content : null;
	const displayMessages = useMemo(() => {
		if (currentAssistantContent !== null) {
			const lastMessage = messages[messages.length - 1];
			if (lastMessage?.role === "assistant") return [...messages.slice(0, -1), {
				...lastMessage,
				content: currentAssistantContent
			}];
		}
		return messages;
	}, [messages, currentAssistantContent]);
	const sendMessage = useCallback((userInput) => {
		if (!userInput.trim() || isStreaming) return;
		const userMessage = {
			id: crypto.randomUUID(),
			role: "user",
			content: userInput
		};
		const assistantMessage = {
			id: crypto.randomUUID(),
			role: "assistant",
			content: ""
		};
		setMessages((prev) => [
			...prev,
			userMessage,
			assistantMessage
		]);
		start(`/api/v1/crok?prompt=${encodeURIComponent(userInput)}`);
	}, [isStreaming, start]);
	if (!activeUser) return /* @__PURE__ */ jsx(CrokGate, {
		headline: "Crokを利用するにはサインインしてください",
		authModalId
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("title", { children: "Crok - CaX" }), /* @__PURE__ */ jsx(CrokPage, {
		isStreaming,
		messages: displayMessages,
		onSendMessage: sendMessage
	})] });
};
//#endregion
//#region app/routes/crok.tsx
var crok_exports = /* @__PURE__ */ __exportAll({
	default: () => crok_default,
	meta: () => meta$1
});
function meta$1() {
	return [{ title: "Crok - CaX" }];
}
var crok_default = UNSAFE_withComponentProps(function CrokRoute() {
	const { activeUser, authModalId } = useLayoutOutletContext();
	return /* @__PURE__ */ jsx(CrokContainer, {
		activeUser,
		authModalId
	});
});
//#endregion
//#region app/routes/$.tsx
var $_exports = /* @__PURE__ */ __exportAll({
	default: () => $_default,
	meta: () => meta
});
function meta() {
	return [{ title: "ページが見つかりません - CaX" }];
}
var $_default = UNSAFE_withComponentProps(function NotFoundRoute() {
	return /* @__PURE__ */ jsx(NotFoundContainer, {});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-HH5tfb_M.js",
		"imports": [
			"/assets/chunk-1p1EYVQ2.js",
			"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
			"/assets/jsx-runtime-P6oPgn4Y.js",
			"/assets/react-BMWhuGU6.js",
			"/assets/preload-helper-CM8YhcCa.js"
		],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/root-DzPId963.js",
			"imports": [
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/preload-helper-CM8YhcCa.js"
			],
			"css": ["/assets/root-BFioTeqd.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/_layout": {
			"id": "routes/_layout",
			"parentId": "root",
			"path": void 0,
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/_layout-BWdEvdLx.js",
			"imports": [
				"/assets/_layout-DlyrdRd5.js",
				"/assets/FontAwesomeIcon-C40moPVE.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/Button-th3C3ceq.js",
				"/assets/Link-BhtkDQxs.js",
				"/assets/Modal-D8qF6Wyv.js",
				"/assets/ModalSubmitButton-BKYshmkS.js",
				"/assets/use_form-BGwiLNZJ.js",
				"/assets/use_ws-BvMIikgR.js",
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/preload-helper-CM8YhcCa.js",
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/fetchers-By-CzXQE.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/_index": {
			"id": "routes/_index",
			"parentId": "routes/_layout",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/_index-B3Tvv6te.js",
			"imports": [
				"/assets/TranslatableText-Rcuay7YA.js",
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/preload-helper-CM8YhcCa.js",
				"/assets/FontAwesomeIcon-C40moPVE.js",
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/Button-th3C3ceq.js",
				"/assets/Modal-D8qF6Wyv.js",
				"/assets/Timeline-D4n9Q6m_.js",
				"/assets/use_infinite_fetch-Dh1obIDV.js",
				"/assets/fetchers-By-CzXQE.js",
				"/assets/format_long_date-C-5qVMHc.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/dm._index": {
			"id": "routes/dm._index",
			"parentId": "routes/_layout",
			"path": "dm",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/dm._index-CoeteHwo.js",
			"imports": [
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/preload-helper-CM8YhcCa.js",
				"/assets/_layout-DlyrdRd5.js",
				"/assets/FontAwesomeIcon-C40moPVE.js",
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/DirectMessageGate-CFUYyXzo.js",
				"/assets/Button-th3C3ceq.js",
				"/assets/Link-BhtkDQxs.js",
				"/assets/Modal-D8qF6Wyv.js",
				"/assets/ModalSubmitButton-BKYshmkS.js",
				"/assets/use_form-BGwiLNZJ.js",
				"/assets/use_ws-BvMIikgR.js",
				"/assets/fetchers-By-CzXQE.js",
				"/assets/format_long_date-C-5qVMHc.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/dm.$conversationId": {
			"id": "routes/dm.$conversationId",
			"parentId": "routes/_layout",
			"path": "dm/:conversationId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/dm._conversationId-DThO2uUc.js",
			"imports": [
				"/assets/_layout-DlyrdRd5.js",
				"/assets/FontAwesomeIcon-C40moPVE.js",
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/NotFoundContainer-DtE0FzFK.js",
				"/assets/DirectMessageGate-CFUYyXzo.js",
				"/assets/DirectMessageContainer-C5ZhU1v7.js",
				"/assets/Button-th3C3ceq.js",
				"/assets/Link-BhtkDQxs.js",
				"/assets/Modal-D8qF6Wyv.js",
				"/assets/ModalSubmitButton-BKYshmkS.js",
				"/assets/use_form-BGwiLNZJ.js",
				"/assets/use_ws-BvMIikgR.js",
				"/assets/format_long_date-C-5qVMHc.js",
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/preload-helper-CM8YhcCa.js",
				"/assets/fetchers-By-CzXQE.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/search": {
			"id": "routes/search",
			"parentId": "routes/_layout",
			"path": "search",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/search-_7RYranZ.js",
			"imports": [
				"/assets/TranslatableText-Rcuay7YA.js",
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/FontAwesomeIcon-C40moPVE.js",
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/Button-th3C3ceq.js",
				"/assets/Modal-D8qF6Wyv.js",
				"/assets/Timeline-D4n9Q6m_.js",
				"/assets/use_form-BGwiLNZJ.js",
				"/assets/fetchers-By-CzXQE.js",
				"/assets/format_long_date-C-5qVMHc.js",
				"/assets/preload-helper-CM8YhcCa.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/users.$username": {
			"id": "routes/users.$username",
			"parentId": "routes/_layout",
			"path": "users/:username",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/users._username-rbOe90YH.js",
			"imports": [
				"/assets/TranslatableText-Rcuay7YA.js",
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/FontAwesomeIcon-C40moPVE.js",
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/NotFoundContainer-DtE0FzFK.js",
				"/assets/Button-th3C3ceq.js",
				"/assets/Modal-D8qF6Wyv.js",
				"/assets/Timeline-D4n9Q6m_.js",
				"/assets/use_infinite_fetch-Dh1obIDV.js",
				"/assets/fetchers-By-CzXQE.js",
				"/assets/format_long_date-C-5qVMHc.js",
				"/assets/preload-helper-CM8YhcCa.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/posts.$postId": {
			"id": "routes/posts.$postId",
			"parentId": "routes/_layout",
			"path": "posts/:postId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/posts._postId-BUEFyKhJ.js",
			"imports": [
				"/assets/TranslatableText-Rcuay7YA.js",
				"/assets/FontAwesomeIcon-C40moPVE.js",
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/NotFoundContainer-DtE0FzFK.js",
				"/assets/Button-th3C3ceq.js",
				"/assets/Link-BhtkDQxs.js",
				"/assets/Modal-D8qF6Wyv.js",
				"/assets/PostContainer-B_pV3err.js",
				"/assets/use_infinite_fetch-Dh1obIDV.js",
				"/assets/format_long_date-C-5qVMHc.js",
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/preload-helper-CM8YhcCa.js",
				"/assets/fetchers-By-CzXQE.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/terms": {
			"id": "routes/terms",
			"parentId": "routes/_layout",
			"path": "terms",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/terms-CSeJgZH2.js",
			"imports": [
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/preload-helper-CM8YhcCa.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/crok": {
			"id": "routes/crok",
			"parentId": "routes/_layout",
			"path": "crok",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/crok-DPZAVTqZ.js",
			"imports": [
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/preload-helper-CM8YhcCa.js",
				"/assets/_layout-DlyrdRd5.js",
				"/assets/FontAwesomeIcon-C40moPVE.js",
				"/assets/longest-streak-D0MSarG1.js",
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/Button-th3C3ceq.js",
				"/assets/Link-BhtkDQxs.js",
				"/assets/Modal-D8qF6Wyv.js",
				"/assets/ModalSubmitButton-BKYshmkS.js",
				"/assets/use_form-BGwiLNZJ.js",
				"/assets/use_ws-BvMIikgR.js",
				"/assets/fetchers-By-CzXQE.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/$": {
			"id": "routes/$",
			"parentId": "routes/_layout",
			"path": "*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasErrorBoundary": false,
			"module": "/assets/_-Ce7KdhOa.js",
			"imports": [
				"/assets/chunk-OIYGIGL5-DDDOLv3B.js",
				"/assets/jsx-runtime-P6oPgn4Y.js",
				"/assets/react-BMWhuGU6.js",
				"/assets/NotFoundContainer-DtE0FzFK.js",
				"/assets/chunk-1p1EYVQ2.js",
				"/assets/preload-helper-CM8YhcCa.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-da85bc93.js",
	"version": "da85bc93",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"v8_middleware": false,
	"unstable_optimizeDeps": false,
	"unstable_splitRouteModules": false,
	"unstable_subResourceIntegrity": false,
	"unstable_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = ["/terms"];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/_layout": {
		id: "routes/_layout",
		parentId: "root",
		path: void 0,
		index: void 0,
		caseSensitive: void 0,
		module: _layout_exports
	},
	"routes/_index": {
		id: "routes/_index",
		parentId: "routes/_layout",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: _index_exports
	},
	"routes/dm._index": {
		id: "routes/dm._index",
		parentId: "routes/_layout",
		path: "dm",
		index: void 0,
		caseSensitive: void 0,
		module: dm__index_exports
	},
	"routes/dm.$conversationId": {
		id: "routes/dm.$conversationId",
		parentId: "routes/_layout",
		path: "dm/:conversationId",
		index: void 0,
		caseSensitive: void 0,
		module: dm_$conversationId_exports
	},
	"routes/search": {
		id: "routes/search",
		parentId: "routes/_layout",
		path: "search",
		index: void 0,
		caseSensitive: void 0,
		module: search_exports
	},
	"routes/users.$username": {
		id: "routes/users.$username",
		parentId: "routes/_layout",
		path: "users/:username",
		index: void 0,
		caseSensitive: void 0,
		module: users_$username_exports
	},
	"routes/posts.$postId": {
		id: "routes/posts.$postId",
		parentId: "routes/_layout",
		path: "posts/:postId",
		index: void 0,
		caseSensitive: void 0,
		module: posts_$postId_exports
	},
	"routes/terms": {
		id: "routes/terms",
		parentId: "routes/_layout",
		path: "terms",
		index: void 0,
		caseSensitive: void 0,
		module: terms_exports
	},
	"routes/crok": {
		id: "routes/crok",
		parentId: "routes/_layout",
		path: "crok",
		index: void 0,
		caseSensitive: void 0,
		module: crok_exports
	},
	"routes/$": {
		id: "routes/$",
		parentId: "routes/_layout",
		path: "*",
		index: void 0,
		caseSensitive: void 0,
		module: $_exports
	}
};
//#endregion
export { server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
