import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Calendar, Key, Mail, LogOut, CheckCircle, Award } from 'lucide-react';
import { Button, useToast } from '../components/ui';

export default function Profile() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    addToast('Signed out successfully.', 'success');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950/20 min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Glow decorations */}
      <div className="absolute top-1/4 left-1/3 h-96 w-96 bg-emerald-100 dark:bg-emerald-950/15 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-3xl mx-auto relative z-10 space-y-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-md">
                <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-450 border border-emerald-100/60 dark:border-emerald-900/30">
                  <User className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8 space-y-6">
            {/* User Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                  <span>{user.email.split('@')[0]}</span>
                  {user.role === 'farmer' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/30">
                      <Award className="h-3 w-3" />
                      Farmer Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 border border-blue-200/40 dark:border-blue-900/30">
                      <Award className="h-3 w-3" />
                      Processor Account
                    </span>
                  )}
                </h1>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{user.email}</p>
              </div>

              <Button onClick={handleSignOut} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/20 py-2.5 self-start sm:self-center cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Terminate Session</span>
              </Button>
            </div>

            {/* Profile Grid Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Account Credentials</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-xs text-slate-400">Email Address</p>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Key className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-xs text-slate-400">Database User Identifier</p>
                      <p className="font-mono text-xs">UID-{user.id.toString().padStart(6, '0')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-xs text-slate-400">Account Status</p>
                      <p className="font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Active & Verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Security Profile</h3>
                
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Shield className="h-4 w-4" />
                    <span>JWT Signature Verification Active</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Active Token Payload (HMAC-SHA256)</p>
                    <div className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 font-mono text-[9px] text-slate-500 dark:text-slate-400 overflow-x-auto break-all max-h-16">
                      {user.token}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security protocol notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 select-none">
          <Shield className="h-4 w-4 text-emerald-500" />
          <span>AgroLink Authentication Protocol • Session auto-terminates in 7 days</span>
        </div>
      </div>
    </div>
  );
}
