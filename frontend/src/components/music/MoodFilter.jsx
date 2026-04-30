import { moods } from '../../lib/constants';
import { cn } from '../../lib/utils';

function MoodFilter({ selectedMood, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      {moods.map((mood) => (
        <button
          key={mood}
          type="button"
          onClick={() => onSelect(mood)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium capitalize transition',
            selectedMood === mood
              ? 'border-brand-300 bg-brand-500/20 text-white'
              : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20',
          )}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}

export default MoodFilter;
