import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../components/forms/AuthForm';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState('');

  async function handleSubmit(payload) {
    setLoading(true);
    setLocalError('');
    setError('');
    try {
      await login(payload);
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.18),transparent_18%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.16),transparent_22%)]" />
      <div className="relative z-10 grid w-full max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-brand-200">Mood-aware listening</p>
          <h1 className="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-100">
            Music that moves with how your day actually feels.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-400">
            MoodSync blends social discovery, live listening rooms, and a clean player experience into one fluid app.
          </p>
        </div>

        <div>
          <AuthForm type="login" onSubmit={handleSubmit} loading={loading} error={error} />
          <p className="mt-4 text-center text-sm text-slate-400">
            No account yet?{' '}
            <Link to="/register" className="font-medium text-brand-200 hover:text-brand-100">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
