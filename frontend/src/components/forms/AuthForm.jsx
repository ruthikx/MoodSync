import { useState } from 'react';

function AuthForm({ type, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const payload =
      type === 'login'
        ? {
            email: form.email,
            password: form.password,
          }
        : form;
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md rounded-[2rem] p-8">
      <p className="text-xs uppercase tracking-[0.35em] text-brand-200">
        {type === 'login' ? 'Welcome back' : 'Create account'}
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-100">
        {type === 'login' ? 'Sign in to MoodSync' : 'Start your listening identity'}
      </h1>

      <div className="mt-8 space-y-4">
        {type === 'register' ? (
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Username</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-300"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-300"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-300"
          />
        </label>

        {type === 'register' ? (
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Role</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-300"
            >
              <option value="user">User</option>
              <option value="artist">Artist</option>
            </select>
          </label>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Please wait...' : type === 'login' ? 'Login' : 'Create account'}
      </button>
    </form>
  );
}

export default AuthForm;
