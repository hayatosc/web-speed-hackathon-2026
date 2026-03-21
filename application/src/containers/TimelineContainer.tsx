import { useEffect } from "react";

import { InfiniteScroll } from "@web-speed-hackathon-2026/client/src/components/foundation/InfiniteScroll";
import { TimelinePage } from "@web-speed-hackathon-2026/client/src/components/timeline/TimelinePage";
import { useInfiniteFetch } from "@web-speed-hackathon-2026/client/src/hooks/use_infinite_fetch";
import { fetchJSON } from "@web-speed-hackathon-2026/client/src/utils/fetchers";

export const TimelineContainer = ({ initialPosts }: { initialPosts?: Models.Post[] }) => {
  const { data: posts, fetchMore } = useInfiniteFetch<Models.Post>(
    "/api/v1/posts",
    fetchJSON,
    initialPosts,
  );

  useEffect(() => {
    void import("@web-speed-hackathon-2026/client/src/containers/PostContainer");
  }, []);

  return (
    <InfiniteScroll fetchMore={fetchMore} items={posts}>      <TimelinePage timeline={posts} />
    </InfiniteScroll>
  );
};
