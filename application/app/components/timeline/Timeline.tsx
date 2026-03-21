import { TimelineItem } from "@web-speed-hackathon-2026/client/app/components/timeline/TimelineItem";

interface Props {
  timeline: Models.Post[];
}

export const Timeline = ({ timeline }: Props) => {
  return (
    <section>
      {timeline.map((post, index) => {
        return <TimelineItem key={post.id} post={post} priority={index === 0} />;
      })}
    </section>
  );
};
