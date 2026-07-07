import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, Mail, UserCheck, Sprout } from 'lucide-react';
import { Input, Button, useToast } from '../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields.', 'error');
      return;
    }
    fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: selectedRole })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(d => { throw new Error(d.error || 'Failed to authenticate') });
        }
        return res.json();
      })
      .then(data => {
        addToast(`Welcome back, ${data.email}!`, 'success');
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
        // Dispatch custom storage event to update Navbar instantly
        window.dispatchEvent(new Event('storage'));
      })
      .catch(err => {
        addToast(err.message, 'error');
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      addToast('Please fill in all fields.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    fetch('http://127.0.0.1:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: selectedRole })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(d => { throw new Error(d.error || 'Failed to register') });
        }
        return res.json();
      })
      .then(() => {
        addToast('Account registered successfully! Please login.', 'success');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      })
      .catch(err => {
        addToast(err.message, 'error');
      });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      addToast('Please fill in all fields.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    fetch('http://127.0.0.1:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword: password })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(d => { throw new Error(d.error || 'Failed to reset password') });
        }
        return res.json();
      })
      .then(() => {
        addToast('Password reset successfully! Please login with your new password.', 'success');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      })
      .catch(err => {
        addToast(err.message, 'error');
      });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950/20 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 bg-emerald-100 dark:bg-emerald-950/10 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 bg-emerald-50 dark:bg-emerald-950/5 rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Card Box */}
        <div className="bg-white dark:bg-slate-900 px-8 py-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
              <Sprout className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {mode === 'login' && 'AgroLink Mandi Portal'}
              {mode === 'signup' && 'Create Mandi Account'}
              {mode === 'forgot' && 'Reset Mandi Password'}
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-light">
              {mode === 'login' && 'Connect to your direct crop trading marketplace account'}
              {mode === 'signup' && 'Sign up to sell harvests or procure crops directly'}
              {mode === 'forgot' && 'Provide your email and a new secure password to reset'}
            </p>
          </div>

          {/* Role selector tabs (Only for Login and Sign Up modes) */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedRole('farmer')}
                className={`py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  selectedRole === 'farmer'
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/30 dark:border-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                I am a Farmer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('processor')}
                className={`py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  selectedRole === 'processor'
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/30 dark:border-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                I am a Processor
              </button>
            </div>
          )}

          {/* Forms */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5 text-sm">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="Email address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full"
                  />
                  <Mail className="absolute right-3.5 top-[38px] h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setPassword(''); }}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 focus:outline-none"
                    >
                      Forgot?
                    </button>
                  </div>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full"
                  />
                  <KeyRound className="absolute right-3.5 top-[38px] h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-light">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 dark:bg-slate-800" />
                  <span>Remember session</span>
                </label>
                <div className="flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>SSL Secured</span>
                </div>
              </div>

              <Button type="submit" className="w-full py-3.5 text-sm">
                <span>Authenticate Portal</span>
              </Button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-5 text-sm">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="Email address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full"
                  />
                  <Mail className="absolute right-3.5 top-[38px] h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="relative">
                  <Input
                    label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full"
                  />
                  <KeyRound className="absolute right-3.5 top-[38px] h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full"
                  />
                  <KeyRound className="absolute right-3.5 top-[38px] h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <Button type="submit" className="w-full py-3.5 text-sm bg-emerald-600 hover:bg-emerald-700">
                <span>Register Account</span>
              </Button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-5 text-sm">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="Email address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full"
                  />
                  <Mail className="absolute right-3.5 top-[38px] h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="relative">
                  <Input
                    label="New Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full"
                  />
                  <KeyRound className="absolute right-3.5 top-[38px] h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full"
                  />
                  <KeyRound className="absolute right-3.5 top-[38px] h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              <Button type="submit" className="w-full py-3.5 text-sm bg-blue-600 hover:bg-blue-700">
                <span>Reset Password</span>
              </Button>
            </form>
          )}

          {/* Foot note toggles */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 font-light space-y-3">
            {mode === 'login' && (
              <p>
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setPassword(''); setConfirmPassword(''); }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 focus:outline-none"
                >
                  Sign Up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setPassword(''); setConfirmPassword(''); }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 focus:outline-none"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setPassword(''); setConfirmPassword(''); }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 focus:outline-none"
                >
                  Back to Sign In
                </button>
              </p>
            )}
            <div className="flex items-center justify-center gap-1.5 text-slate-400 dark:text-slate-600">
              <ShieldAlert className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>AgroLink Security Protocol Active</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
