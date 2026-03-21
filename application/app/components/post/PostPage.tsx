import { CommentList } from "@web-speed-hackathon-2026/client/app/components/post/CommentList";
import { PostItem } from "@web-speed-hackathon-2026/client/app/components/post/PostItem";

interface Props {
  comments: Models.Comment[];
  post: Models.Post;
}

export const PostPage = ({ comments, post }: Props) => {
  return (
    <>
      <PostItem post={post} />
      <CommentList comments={comments} />
    </>
  );
};
