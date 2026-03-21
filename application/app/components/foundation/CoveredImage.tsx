import { MouseEvent, useCallback, useId } from "react";

import { Button } from "@web-speed-hackathon-2026/client/app/components/foundation/Button";
import { Modal } from "@web-speed-hackathon-2026/client/app/components/modal/Modal";
import { OptimizedImage } from "@web-speed-hackathon-2026/client/app/components/foundation/OptimizedImage";

interface Props {
  alt: string;
  avifSrc?: string;
  height: number;
  loading?: "eager" | "lazy";
  sizes?: string;
  src: string;
  srcSet?: string;
  width: number;
}

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 */
export const CoveredImage = ({
  alt,
  avifSrc,
  height,
  loading = "eager",
  sizes,
  src,
  srcSet,
  width,
}: Props) => {
  const dialogId = useId();

  // ダイアログの背景をクリックしたときに投稿詳細ページに遷移しないようにする
  const handleDialogClick = useCallback((ev: MouseEvent<HTMLDialogElement>) => {
    ev.stopPropagation();
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <OptimizedImage
        alt={alt}
        avifSrc={avifSrc}
        className="h-full w-full"
        decoding="async"
        fallbackSrc={src}
        height={height}
        loading={loading}
        srcSet={srcSet}
        sizes={sizes}
        style={{ inset: 0, objectFit: "cover", position: "absolute" }}
        width={width}
      />

      <button
        className="border-cax-border bg-cax-surface-raised/90 text-cax-text-muted hover:bg-cax-surface absolute right-1 bottom-1 rounded-full border px-2 py-1 text-center text-xs"
        type="button"
        command="show-modal"
        commandfor={dialogId}
      >
        ALT を表示する
      </button>

      <Modal id={dialogId} closedby="any" onClick={handleDialogClick}>
        <div className="grid gap-y-6">
          <h1 className="text-center text-2xl font-bold">画像の説明</h1>

          <p className="text-sm">
            {alt || "画像の説明はありません"}
          </p>

          <Button variant="secondary" command="close" commandfor={dialogId}>
            閉じる
          </Button>
        </div>
      </Modal>
    </div>
  );
};
