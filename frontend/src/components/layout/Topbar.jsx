import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="glass-panel rounded-[2rem] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Social audio space</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-100">
            Welcome back, {user?.username || 'listener'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 lg:hidden">
            <NavLink to="/" className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300">
              Home
            </NavLink>
            <NavLink
              to="/discover"
              className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300"
            >
              Discover
            </NavLink>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-300 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
