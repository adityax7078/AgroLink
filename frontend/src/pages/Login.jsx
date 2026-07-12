import { useState, useEffect } from 'react';
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

  // Handle OAuth Redirect URL parsing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const emailParam = params.get('email');
    const roleParam = params.get('role');
    const idParam = params.get('id');
    const errorParam = params.get('error');

    if (errorParam) {
      addToast('Authentication via OAuth failed. Please try again.', 'error');
    } else if (token && emailParam && roleParam && idParam) {
      const authUser = {
        token,
        email: emailParam,
        role: roleParam,
        id: idParam
      };
      localStorage.setItem('user', JSON.stringify(authUser));
      addToast(`Successfully authenticated as ${emailParam}!`, 'success');
      // Dispatch custom storage event to update Navbar instantly
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    }
  }, [navigate, addToast]);

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
            <>
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

                <Button type="submit" className="w-full py-3.5 text-sm" id="authenticate-btn">
                  <span>Authenticate Portal</span>
                </Button>
              </form>

              {/* OAuth Options Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="http://localhost:5000/api/auth/google"
                  id="oauth-google-btn"
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-350 transition-all font-semibold text-xs shadow-sm bg-white dark:bg-slate-900 cursor-pointer animate-fade-in"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.012c1.49 0 2.858.543 3.91 1.44l3.12-3.12A9.97 9.97 0 0 0 13.99 2 9.99 9.99 0 0 0 4 12c0 5.523 4.477 10 10 10 5.13 0 9.29-3.88 9.94-8.875h-11.7Z"
                    />
                  </svg>
                  <span>Google</span>
                </a>
                <a
                  href="http://localhost:5000/api/auth/github"
                  id="oauth-github-btn"
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-350 transition-all font-semibold text-xs shadow-sm bg-white dark:bg-slate-900 cursor-pointer animate-fade-in"
                >
                  <svg className="h-4 w-4 fill-current text-slate-800 dark:text-white" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </>
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
