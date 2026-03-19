import { useMemo, useState } from 'react';
import { Stethoscope, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import type { AuthResponse, UserProfile } from '@/types/api';

interface AuthPanelProps {
  onAuthenticated: (user: UserProfile) => void;
  isDarkMode: boolean;
}

export default function AuthPanel({ onAuthenticated, isDarkMode }: AuthPanelProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@medstudy.ke');
  const [password, setPassword] = useState('demo1234');
  const [university, setUniversity] = useState('University of Nairobi');
  const [yearOfStudy, setYearOfStudy] = useState('3');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const heading = useMemo(
    () => (mode === 'login' ? 'Welcome back to MedStudy' : 'Create your medical study account'),
    [mode]
  );

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login'
        ? { email, password }
        : { name, email, password, university, yearOfStudy: Number(yearOfStudy) };

      const response = await apiFetch<AuthResponse>(path, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      localStorage.setItem('medstudy_token', response.token);
      onAuthenticated(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign you in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 pt-24 pb-10 ${isDarkMode ? 'bg-med-bg-dark' : 'bg-med-bg'}`}>
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch">
        <div className="med-card p-8 bg-gradient-to-br from-med-teal via-med-sky to-med-lavender text-white border-none shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-4">Kenyan Med Learning Hub</h1>
          <p className="text-white/85 leading-7 mb-6">
            Study smarter with AI support, progress tracking, topic discussions, revision tools, and a premium dashboard designed for medical students across Kenya.
          </p>
          <div className="space-y-3 text-sm text-white/90">
            <div>• Demo login is prefilled so you can test immediately.</div>
            <div>• Real backend endpoints now power authentication, dashboard data, quizzes, and AI chat.</div>
            <div>• Gemini becomes live after you add your API key in the server environment file.</div>
          </div>
        </div>

        <div className="med-card p-8">
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMode('login')} className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'login' ? 'bg-med-teal text-white' : 'bg-gray-100 dark:bg-white/5 text-med-text dark:text-white'}`}>
              Log in
            </button>
            <button onClick={() => setMode('register')} className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'register' ? 'bg-med-teal text-white' : 'bg-gray-100 dark:bg-white/5 text-med-text dark:text-white'}`}>
              Register
            </button>
          </div>

          <h2 className="font-heading text-2xl font-bold text-med-text dark:text-white mb-2">{heading}</h2>
          <p className="text-sm text-med-text-secondary mb-6">Use the form below to access the live dashboard.</p>

          <div className="space-y-4">
            {mode === 'register' && (
              <>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-med-teal/40 outline-none text-med-text dark:text-white" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="University" className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-med-teal/40 outline-none text-med-text dark:text-white" />
                  <input value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} placeholder="Year of study" className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-med-teal/40 outline-none text-med-text dark:text-white" />
                </div>
              </>
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-med-teal/40 outline-none text-med-text dark:text-white" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-med-teal/40 outline-none text-med-text dark:text-white" />
            {error && <p className="text-sm text-med-coral">{error}</p>}
            <button onClick={handleSubmit} disabled={loading} className="w-full med-btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Log in to dashboard' : 'Create account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
