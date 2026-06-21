import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Twitter, Facebook, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      {/* Top section with grids */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Sprout className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Agro<span className="text-emerald-500">Link</span>
              </span>
            </NavLink>
            <p className="text-sm leading-relaxed text-slate-400 font-light">
              India's direct agricultural trade marketplace connecting farmers to food processing units. Promoting transparent pricing, AI-based recommendations, and hassle-free transactions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition-all duration-200">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition-all duration-200">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition-all duration-200">
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/" className="hover:text-emerald-500 transition-colors flex items-center gap-1 group">
                  <span>Home</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className="hover:text-emerald-500 transition-colors flex items-center gap-1 group">
                  <span>Marketplace</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-emerald-500 transition-colors flex items-center gap-1 group">
                  <span>About Us</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className="hover:text-emerald-500 transition-colors flex items-center gap-1 group">
                  <span>Portal Login</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Support Line Info (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Farmer Support</h4>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>1800-419-5566 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="break-all">support@agrolink.org.in</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Krishi Bhawan, Sector-5, Noida, UP, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Box (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Stay Updated</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Get notified of major mandi rates and processor demand spikes in your area.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors shadow-sm shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-slate-800 bg-slate-950/60 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} AgroLink Marketplace. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Trade</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Faq</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
