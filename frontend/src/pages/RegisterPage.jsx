import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../components/forms/AuthForm';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, setError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState('');

  async function handleSubmit(payload) {
    setLoading(true);
    setLocalError('');
    setError('');
    try {
      await register(payload);
      navigate('/');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(20,184,166,0.18),transparent_18%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.16),transparent_24%)]" />
      <div className="relative z-10 grid w-full max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <AuthForm type="register" onSubmit={handleSubmit} loading={loading} error={error} />
          <p className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-200 hover:text-brand-100">
              Login
            </Link>
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-brand-200">Build your sonic profile</p>
          <h1 className="mt-5 max-w-xl text-5xl font-bold leading-tight text-slate-100">
            Register once, then carry your vibe across rooms, playlists, and discoveries.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-400">
            Choose your role, keep your library in motion, and jump straight into collaborative listening.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
