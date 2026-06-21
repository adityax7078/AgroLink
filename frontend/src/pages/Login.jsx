import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, Mail, UserCheck, Sprout } from 'lucide-react';
import { Input, Button, useToast } from '../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    addToast(`Logged in successfully as ${selectedRole === 'farmer' ? 'Farmer' : 'Processor'}!`, 'success');
    navigate('/dashboard');
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
              AgroLink Mandi Portal
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-light">
              Connect to your direct crop trading marketplace account
            </p>
          </div>

          {/* Role selector tabs */}
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

          {/* Form */}
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
                  <a href="#" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">Forgot?</a>
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

            {/* Remember me & terms */}
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

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3.5 text-sm"
            >
              <span>Authenticate Portal</span>
            </Button>
          </form>

          {/* Foot note */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 font-light flex items-center justify-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Need an account? Contact rural nodal offices to signup.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
