import { DocumentTitle } from "@web-speed-hackathon-2026/client/app/components/foundation/DocumentTitle";
import { InfiniteScroll } from "@web-speed-hackathon-2026/client/app/components/foundation/InfiniteScroll";
import { TimelinePage } from "@web-speed-hackathon-2026/client/app/components/timeline/TimelinePage";
import { useInfiniteFetch } from "@web-speed-hackathon-2026/client/app/hooks/use_infinite_fetch";
import { fetchJSON } from "@web-speed-hackathon-2026/client/app/utils/fetchers";

export const TimelineContainer = ({ initialPosts }: { initialPosts?: Models.Post[] }) => {
  const { data: posts, fetchMore } = useInfiniteFetch<Models.Post>(
    "/api/v1/posts",
    fetchJSON,
    initialPosts,
  );

  return (
    <InfiniteScroll fetchMore={fetchMore} items={posts}>
      <DocumentTitle title="タイムライン - CaX" />
      <TimelinePage timeline={posts} />
    </InfiniteScroll>
  );
};
