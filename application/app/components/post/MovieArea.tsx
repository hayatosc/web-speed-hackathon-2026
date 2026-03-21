import { PausableMovie } from "@web-speed-hackathon-2026/client/app/components/foundation/PausableMovie";
import { getMoviePath } from "@web-speed-hackathon-2026/client/app/utils/get_path";

interface Props {
  movie: Models.Movie;
  priority?: boolean;
}

export const MovieArea = ({ movie, priority }: Props) => {
  return (
    <div
      className="border-cax-border bg-cax-surface-subtle relative h-full w-full overflow-hidden rounded-lg border"
      data-movie-area
    >
      <PausableMovie src={getMoviePath(movie.id)} priority={priority} />
    </div>
  );
};
