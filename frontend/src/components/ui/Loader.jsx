import { cn } from '../../lib/utils';

function Loader({ label = 'Loading...', fullScreen = false, className = '' }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 text-slate-300',
        fullScreen ? 'min-h-screen' : 'min-h-[16rem]',
        className,
      )}
    >
      <div className="h-3 w-3 animate-pulse rounded-full bg-brand-300" />
      <div className="h-3 w-3 animate-pulse rounded-full bg-brand-400 [animation-delay:150ms]" />
      <div className="h-3 w-3 animate-pulse rounded-full bg-brand-500 [animation-delay:300ms]" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default Loader;
