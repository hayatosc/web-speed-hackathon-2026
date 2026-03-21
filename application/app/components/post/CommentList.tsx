import { CommentItem } from "@web-speed-hackathon-2026/client/app/components/post/CommentItem";

interface Props {
  comments: Models.Comment[];
}

export const CommentList = ({ comments }: Props) => {
  return (
    <div>
      {comments.map((comment) => {
        return <CommentItem key={comment.id} comment={comment} />;
      })}
    </div>
  );
};
