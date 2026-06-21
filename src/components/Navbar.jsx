import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/dashboard' },
    { name: 'About Us', path: '/about' },
    { name: 'Portal Login', path: '/login' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Sprout className="h-6 w-6 text-emerald-600 animate-pulse" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                Agro<span className="text-emerald-600">Link</span>
              </span>
            </NavLink>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 border-b-2 py-1 px-0.5 ${
                    isActive
                      ? 'border-emerald-600 text-emerald-600 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-emerald-600 hover:border-emerald-200'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Button & Profile */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <User className="h-4 w-4 text-slate-500" />
              <span>Sign In</span>
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-50 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64 border-b border-slate-200 bg-white' : 'max-h-0'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <div className="pt-4 pb-2 border-t border-slate-100 px-3">
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <User className="h-4 w-4" />
              <span>Portal Login</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
