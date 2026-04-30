import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn, initials } from '../../lib/utils';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/playlists', label: 'Playlists' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/profile', label: 'Profile' },
];

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-3xl p-6 lg:flex lg:flex-col">
      <div className="mb-8">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 text-lg font-bold text-brand-100">
          MS
        </div>
        <h1 className="text-2xl font-bold text-gradient">MoodSync</h1>
        <p className="mt-2 text-sm text-slate-400">Find your mood. Share your orbit.</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/5',
                isActive ? 'bg-white/10 text-white shadow-glow' : 'text-slate-400',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-sm font-semibold text-slate-200">
            {initials(user?.username || user?.email || 'MS')}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">{user?.username || 'Listener'}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{user?.role || 'user'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
