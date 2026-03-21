import { Button } from "@web-speed-hackathon-2026/client/src/components/foundation/Button";
import { FontAwesomeIcon } from "@web-speed-hackathon-2026/client/src/components/foundation/FontAwesomeIcon";
import { Link } from "@web-speed-hackathon-2026/client/src/components/foundation/Link";
import { getProfileImagePath } from "@web-speed-hackathon-2026/client/src/utils/get_path";

const relativeTimeFormatter = new Intl.RelativeTimeFormat("ja", { numeric: "auto" });

function formatRelativeTime(value: Date | string): string {
  const targetMs = new Date(value).getTime();
  const diffMs = targetMs - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 60) {
    return relativeTimeFormatter.format(diffSeconds, "second");
  }

  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) {
    return relativeTimeFormatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return relativeTimeFormatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) {
    return relativeTimeFormatter.format(diffDays, "day");
  }

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) {
    return relativeTimeFormatter.format(diffMonths, "month");
  }

  const diffYears = Math.round(diffMonths / 12);
  return relativeTimeFormatter.format(diffYears, "year");
}

interface Props {
  activeUser: Models.User;
  conversations: Array<Models.DirectMessageConversationSummary> | null;
  error: Error | null;
  newDmModalId: string;
}

export const DirectMessageListPage = ({ activeUser, conversations, error, newDmModalId }: Props) => {
  if (conversations == null) {
    return null;
  }

  return (
    <section>
      <header className="border-cax-border flex flex-col gap-4 border-b px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">ダイレクトメッセージ</h1>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            command="show-modal"
            commandfor={newDmModalId}
            leftItem={<FontAwesomeIcon iconType="paper-plane" styleType="solid" />}
          >
            新しくDMを始める
          </Button>
        </div>
      </header>

      {error != null ? (
        <p className="text-cax-danger px-4 py-6 text-center text-sm">DMの取得に失敗しました</p>
      ) : conversations.length === 0 ? (
        <p className="text-cax-text-muted px-4 py-6 text-center">
          まだDMで会話した相手がいません。
        </p>
      ) : (
        <ul data-testid="dm-list">
          {conversations.map((conversation) => {
            const peer =
              conversation.initiator.id !== activeUser.id
                ? conversation.initiator
                : conversation.member;
            const { hasUnread, lastMessage } = conversation;

            return (
              <li className="grid" key={conversation.id}>
                <Link className="hover:bg-cax-surface-subtle px-4" to={`/dm/${conversation.id}`}>
                  <div className="border-cax-border flex gap-4 border-b px-4 pt-2 pb-4">
                    <img
                      alt={peer.profileImage.alt}
                      className="w-12 shrink-0 self-start rounded-full"
                      height={48}
                      src={getProfileImagePath(peer.profileImage.id)}
                      width={48}
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">{peer.name}</p>
                          <p className="text-cax-text-muted text-xs">@{peer.username}</p>
                        </div>
                        {lastMessage != null && (
                          <time
                            className="text-cax-text-subtle text-xs"
                            dateTime={lastMessage.createdAt}
                          >
                            {formatRelativeTime(lastMessage.createdAt)}
                          </time>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm wrap-anywhere">{lastMessage?.body}</p>
                      {hasUnread ? (
                        <span className="bg-cax-brand-soft text-cax-brand mt-2 inline-flex w-fit rounded-full px-3 py-0.5 text-xs">
                          未読
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
