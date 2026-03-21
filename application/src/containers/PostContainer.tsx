import { useLocation, useParams } from "react-router";

import { InfiniteScroll } from "@web-speed-hackathon-2026/client/src/components/foundation/InfiniteScroll";
import { PostPage } from "@web-speed-hackathon-2026/client/src/components/post/PostPage";
import { NotFoundContainer } from "@web-speed-hackathon-2026/client/src/containers/NotFoundContainer";
import { useFetch } from "@web-speed-hackathon-2026/client/src/hooks/use_fetch";
import { useInfiniteFetch } from "@web-speed-hackathon-2026/client/src/hooks/use_infinite_fetch";
import { fetchJSON } from "@web-speed-hackathon-2026/client/src/utils/fetchers";

interface PostLocationState {
  post?: Models.Post;
}

function getInitialPost(state: unknown, postId: string | undefined): Models.Post | null {
  if (postId === undefined || typeof state !== "object" || state === null || !("post" in state)) {
    return null;
  }

  const candidate = (state as PostLocationState).post;
  if (candidate == null || candidate.id !== postId) {
    return null;
  }

  return candidate;
}

const PostContainerContent = ({
  postId,
  initialPost: loaderPost,
}: {
  postId: string | undefined;
  initialPost?: Models.Post;
}) => {
  const location = useLocation();
  const statePost = getInitialPost(location.state, postId);
  const seedPost = loaderPost ?? statePost ?? undefined;
  const { data: fetchedPost, isLoading: isLoadingPost } = useFetch<Models.Post>(
    `/api/v1/posts/${postId}`,
    fetchJSON,
    seedPost,
  );
  const post = fetchedPost ?? seedPost ?? null;

  const { data: comments, fetchMore } = useInfiniteFetch<Models.Comment>(
    `/api/v1/posts/${postId}/comments`,
    fetchJSON,
  );

  if (isLoadingPost && post === null) {
    return (
      <title>読込中 - CaX</title>
    );
  }

  if (post === null) {
    return <NotFoundContainer />;
  }

  return (
    <InfiniteScroll fetchMore={fetchMore} items={comments}>      <PostPage comments={comments} post={post} />
    </InfiniteScroll>
  );
};

export const PostContainer = ({ initialPost }: { initialPost?: Models.Post }) => {
  const { postId } = useParams();
  return <PostContainerContent key={postId} postId={postId} initialPost={initialPost} />;
};
