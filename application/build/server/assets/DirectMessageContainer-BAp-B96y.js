import { n as __exportAll } from "./chunk-CNvmzFzq.js";
import { a as toISOString, c as fetchJSON, i as formatShortTime, p as getProfileImagePath, t as NotFoundContainer, u as sendJSON } from "./NotFoundContainer-BARjtfSb.js";
import { t as FontAwesomeIcon } from "./FontAwesomeIcon-DFvxoWSs.js";
import { useParams } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useEffectEvent, useId, useRef, useState } from "react";
import classNames from "classnames";
//#region src/hooks/use_ws.ts
function useWs(url, onMessage) {
	const handleMessage = useEffectEvent((event) => {
		onMessage(JSON.parse(event.data));
	});
	useEffect(() => {
		const ws = new WebSocket(url);
		ws.addEventListener("message", handleMessage);
		return () => {
			ws.removeEventListener("message", handleMessage);
			ws.close();
		};
	}, [url]);
}
//#endregion
//#region src/components/direct_message/DirectMessageGate.tsx
var DirectMessageGate = ({ headline, description = "サインインするとダイレクトメッセージ機能をご利用いただけます。", buttonLabel = "サインイン", authModalId }) => {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("title", { children: "ダイレクトメッセージ - CaX" }), /* @__PURE__ */ jsxs("section", {
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
//#region src/components/direct_message/DirectMessagePage.tsx
var DirectMessagePage = ({ conversationError, conversation, activeUser, isPeerTyping, isSubmitting, onTyping, onSubmit }) => {
	const formRef = useRef(null);
	const textAreaId = useId();
	const peer = conversation.initiator.id !== activeUser.id ? conversation.initiator : conversation.member;
	const [text, setText] = useState("");
	const textAreaRows = Math.min((text || "").split("\n").length, 5);
	const isInvalid = text.trim().length === 0;
	const scrollHeightRef = useRef(0);
	const handleChange = useCallback((event) => {
		setText(event.target.value);
		onTyping();
	}, [onTyping]);
	const handleKeyDown = useCallback((event) => {
		if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault();
			formRef.current?.requestSubmit();
		}
	}, [formRef]);
	const handleSubmit = useCallback((event) => {
		event.preventDefault();
		onSubmit({ body: text.trim() }).then(() => {
			setText("");
		});
	}, [onSubmit, text]);
	useEffect(() => {
		const id = setInterval(() => {
			const height = Number(window.getComputedStyle(document.body).height.replace("px", ""));
			if (height !== scrollHeightRef.current) {
				scrollHeightRef.current = height;
				window.scrollTo(0, height);
			}
		}, 1);
		return () => clearInterval(id);
	}, []);
	if (conversationError != null) return /* @__PURE__ */ jsx("section", {
		className: "px-6 py-10",
		children: /* @__PURE__ */ jsx("p", {
			className: "text-cax-danger text-sm",
			children: "メッセージの取得に失敗しました"
		})
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "bg-cax-surface flex min-h-[calc(100vh-(--spacing(12)))] flex-col lg:min-h-screen",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "border-cax-border bg-cax-surface sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3",
				children: [/* @__PURE__ */ jsx("img", {
					alt: peer.profileImage.alt,
					className: "h-12 w-12 rounded-full object-cover",
					src: getProfileImagePath(peer.profileImage.id)
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "overflow-hidden text-xl font-bold text-ellipsis whitespace-nowrap",
						children: peer.name
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-cax-text-muted overflow-hidden text-xs text-ellipsis whitespace-nowrap",
						children: ["@", peer.username]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-cax-surface-subtle flex-1 space-y-4 overflow-y-auto px-4 pt-4 pb-8",
				children: [conversation.messages.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "text-cax-text-muted text-center text-sm",
					children: "まだメッセージはありません。最初のメッセージを送信してみましょう。"
				}), /* @__PURE__ */ jsx("ul", {
					className: "grid gap-3",
					"data-testid": "dm-message-list",
					children: conversation.messages.map((message) => {
						const isActiveUserSend = message.sender.id === activeUser.id;
						return /* @__PURE__ */ jsxs("li", {
							className: classNames("flex flex-col w-full", isActiveUserSend ? "items-end" : "items-start"),
							children: [/* @__PURE__ */ jsx("p", {
								className: classNames("max-w-3/4 rounded-xl border px-4 py-2 text-sm whitespace-pre-wrap leading-relaxed wrap-anywhere", isActiveUserSend ? "rounded-br-sm border-transparent bg-cax-brand text-cax-surface-raised" : "rounded-bl-sm border-cax-border bg-cax-surface text-cax-text"),
								children: message.body
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex gap-1 text-xs",
								children: [/* @__PURE__ */ jsx("time", {
									dateTime: toISOString(message.createdAt),
									children: formatShortTime(message.createdAt)
								}), isActiveUserSend && message.isRead && /* @__PURE__ */ jsx("span", {
									className: "text-cax-text-muted",
									children: "既読"
								})]
							})]
						});
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "sticky bottom-12 z-10 lg:bottom-0",
				children: [isPeerTyping && /* @__PURE__ */ jsxs("p", {
					className: "bg-cax-surface-raised/75 text-cax-brand absolute inset-x-0 top-0 -translate-y-full px-4 py-1 text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-bold",
						children: peer.name
					}), "さんが入力中…"]
				}), /* @__PURE__ */ jsxs("form", {
					className: "border-cax-border bg-cax-surface flex items-end gap-2 border-t p-4",
					onSubmit: handleSubmit,
					ref: formRef,
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex grow",
						children: [/* @__PURE__ */ jsx("label", {
							className: "sr-only",
							htmlFor: textAreaId,
							children: "内容"
						}), /* @__PURE__ */ jsx("textarea", {
							id: textAreaId,
							className: "border-cax-border placeholder-cax-text-subtle focus:outline-cax-brand w-full resize-none rounded-xl border px-3 py-2 focus:outline-2 focus:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
							value: text,
							onChange: handleChange,
							onKeyDown: handleKeyDown,
							rows: textAreaRows,
							disabled: isSubmitting
						})]
					}), /* @__PURE__ */ jsx("button", {
						className: "bg-cax-brand text-cax-surface-raised hover:bg-cax-brand-strong rounded-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50",
						disabled: isInvalid || isSubmitting,
						type: "submit",
						children: /* @__PURE__ */ jsx(FontAwesomeIcon, {
							iconType: "arrow-right",
							styleType: "solid"
						})
					})]
				})]
			})
		]
	});
};
//#endregion
//#region src/containers/DirectMessageContainer.tsx
var DirectMessageContainer_exports = /* @__PURE__ */ __exportAll({ DirectMessageContainer: () => DirectMessageContainer });
var TYPING_INDICATOR_DURATION_MS = 10 * 1e3;
var DirectMessageContainer = ({ activeUser, authModalId }) => {
	const { conversationId = "" } = useParams();
	const [conversation, setConversation] = useState(null);
	const [conversationError, setConversationError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isPeerTyping, setIsPeerTyping] = useState(false);
	const peerTypingTimeoutRef = useRef(null);
	const loadConversation = useCallback(async () => {
		if (activeUser == null) return;
		try {
			setConversation(await fetchJSON(`/api/v1/dm/${conversationId}`));
			setConversationError(null);
		} catch (error) {
			setConversation(null);
			setConversationError(error);
		}
	}, [activeUser, conversationId]);
	const sendRead = useCallback(async () => {
		await sendJSON(`/api/v1/dm/${conversationId}/read`, {});
	}, [conversationId]);
	useEffect(() => {
		loadConversation();
		sendRead();
	}, [loadConversation, sendRead]);
	const handleSubmit = useCallback(async (params) => {
		setIsSubmitting(true);
		try {
			await sendJSON(`/api/v1/dm/${conversationId}/messages`, { body: params.body });
			loadConversation();
		} finally {
			setIsSubmitting(false);
		}
	}, [conversationId, loadConversation]);
	const handleTyping = useCallback(async () => {
		sendJSON(`/api/v1/dm/${conversationId}/typing`, {});
	}, [conversationId]);
	useWs(`/api/v1/dm/${conversationId}/ws`, (event) => {
		if (event.type === "dm:conversation:message") {
			loadConversation().then(() => {
				if (event.payload.sender.id !== activeUser?.id) {
					setIsPeerTyping(false);
					if (peerTypingTimeoutRef.current !== null) clearTimeout(peerTypingTimeoutRef.current);
					peerTypingTimeoutRef.current = null;
				}
			});
			sendRead();
		} else if (event.type === "dm:conversation:typing") {
			setIsPeerTyping(true);
			if (peerTypingTimeoutRef.current !== null) clearTimeout(peerTypingTimeoutRef.current);
			peerTypingTimeoutRef.current = setTimeout(() => {
				setIsPeerTyping(false);
			}, TYPING_INDICATOR_DURATION_MS);
		}
	});
	if (activeUser === null) return /* @__PURE__ */ jsx(DirectMessageGate, {
		headline: "DMを利用するにはサインインしてください",
		authModalId
	});
	if (conversation == null) {
		if (conversationError != null) return /* @__PURE__ */ jsx(NotFoundContainer, {});
		return null;
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("title", { children: [(conversation.initiator.id !== activeUser?.id ? conversation.initiator : conversation.member).name, " さんとのダイレクトメッセージ - CaX"] }), /* @__PURE__ */ jsx(DirectMessagePage, {
		conversationError,
		conversation,
		activeUser,
		onTyping: handleTyping,
		isPeerTyping,
		isSubmitting,
		onSubmit: handleSubmit
	})] });
};
//#endregion
export { useWs as i, DirectMessageContainer_exports as n, DirectMessageGate as r, DirectMessageContainer as t };
