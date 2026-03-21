import { FastAverageColor } from "fast-average-color";
import { ReactEventHandler, useCallback, useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@web-speed-hackathon-2026/client/app/components/foundation/FontAwesomeIcon";
import { formatLongDate, toISOString } from "@web-speed-hackathon-2026/client/app/utils/format_long_date";
import { getProfileImagePath } from "@web-speed-hackathon-2026/client/app/utils/get_path";

interface Props {
  user: Models.User;
}

export const UserProfileHeader = ({ user }: Props) => {
  const [averageColor, setAverageColor] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const updateAverageColor = useCallback((image: HTMLImageElement) => {
    const fac = new FastAverageColor();

    try {
      const { rgb } = fac.getColor(image, { mode: "precision" });
      setAverageColor(rgb);
    } catch {
      setAverageColor(null);
    } finally {
      fac.destroy();
    }
  }, []);

  // 画像の平均色を取得します
  /** @type {React.ReactEventHandler<HTMLImageElement>} */
  const handleLoadImage = useCallback<ReactEventHandler<HTMLImageElement>>((ev) => {
    updateAverageColor(ev.currentTarget);
  }, [updateAverageColor]);

  useEffect(() => {
    const image = imageRef.current;

    if (image == null || !image.complete) {
      return;
    }

    updateAverageColor(image);
  }, [updateAverageColor, user.profileImage.id]);

  return (
    <header className="relative">
      <div
        className="bg-cax-surface-subtle h-32"
        style={averageColor ? { backgroundColor: averageColor } : undefined}
      ></div>
      <div className="border-cax-border bg-cax-surface-subtle absolute left-2/4 m-0 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border sm:h-32 sm:w-32">
        <img
          alt=""
          height={user.profileImage.height}
          onLoad={handleLoadImage}
          ref={imageRef}
          src={getProfileImagePath(user.profileImage.id)}
          width={user.profileImage.width}
        />
      </div>
      <div className="px-4 pt-20">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-cax-text-muted">@{user.username}</p>
        <p className="pt-2">{user.description}</p>
        <p className="text-cax-text-muted pt-2 text-sm">
          <span className="pr-1">
            <FontAwesomeIcon iconType="calendar-alt" styleType="regular" />
          </span>
          <span>
            <time dateTime={toISOString(user.createdAt)}>
              {formatLongDate(user.createdAt)}
            </time>
            からサービスを利用しています
          </span>
        </p>
      </div>
    </header>
  );
};
