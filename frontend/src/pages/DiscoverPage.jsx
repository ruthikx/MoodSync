import SectionHeading from '../components/ui/SectionHeading';
import SwipeDeck from '../components/discover/SwipeDeck';
import { useMusic } from '../context/MusicContext';

function DiscoverPage() {
  const { songs, likes, toggleLike } = useMusic();

  return (
    <div>
      <SectionHeading
        eyebrow="Discover"
        title="Swipe through your next obsession"
        description="A fast, card-based discovery flow for liking or skipping tracks without losing the playlist mindset."
      />
      <SwipeDeck songs={songs} likes={likes} onLike={toggleLike} />
    </div>
  );
}

export default DiscoverPage;
