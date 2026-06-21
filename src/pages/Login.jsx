import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, Mail, UserCheck, Sprout } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logged in successfully as ${selectedRole === 'farmer' ? 'Farmer' : 'Processor'}!`);
    navigate('/dashboard');
  };

  return (
    <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 bg-emerald-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 bg-emerald-50 rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Card Box */}
        <div className="bg-white px-8 py-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-8">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
              <Sprout className="h-8 w-8 text-emerald-600 animate-pulse" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              AgroLink Mandi Portal
            </h2>
            <p className="text-sm text-slate-400 font-light">
              Connect to your direct crop trading marketplace account
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setSelectedRole('farmer')}
              className={`py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                selectedRole === 'farmer'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/30'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              I am a Farmer
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('processor')}
              className={`py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                selectedRole === 'processor'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/30'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              I am a Processor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 text-sm">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-semibold text-slate-600">Password</label>
                  <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Forgot?</a>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Remember me & terms */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-light">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span>Remember session</span>
              </label>
              <div className="flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>SSL Secured</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-2"
            >
              <span>Authenticate Portal</span>
            </button>
          </form>

          {/* Foot note */}
          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400 font-light flex items-center justify-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-emerald-600" />
            <span>Need an account? Contact rural nodal offices to signup.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
