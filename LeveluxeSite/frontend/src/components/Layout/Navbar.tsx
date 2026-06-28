import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Music4, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Instructors', path: '/instructors' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Contact', path: '/contact' },
  ];

  const activeStyle = "text-yellow-400 border-b-2 border-yellow-500 font-bold px-1 py-1.5 text-sm";
  const inactiveStyle = "text-neutral-350 hover:text-yellow-400 transition-colors duration-200 px-1 py-1.5 text-sm";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-neutral-950/90 backdrop-blur-md shadow-lg border-b border-neutral-900/60 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-10 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2 font-bold text-xl">
              <Music4 className="h-6 w-6 text-yellow-500" />
              <span className="tracking-tight text-white font-extrabold">LEVELUXE</span>
            </NavLink>
          </div>
 
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
              >
                {link.name}
              </NavLink>
            ))}

            {isAuthenticated && user ? (
              /* Authenticated User Menu Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2.5 focus:outline-none bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 py-1.5 px-3 rounded-full transition-all cursor-pointer text-left active:scale-98"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-600 text-neutral-950 font-bold text-xs flex items-center justify-center shadow-md">
                    {getInitials(user.full_name)}
                  </div>
                  <span className="text-xs font-semibold text-neutral-200 max-w-[100px] truncate">
                    {user.full_name}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-neutral-450 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-neutral-900/95 border border-neutral-800 shadow-2xl p-2 z-50 text-xs backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3.5 py-2.5 border-b border-neutral-850">
                      <span className="font-bold text-white block">{user.full_name}</span>
                      <span className="text-[10px] text-neutral-500 block truncate">{user.email}</span>
                      <span className="text-[9px] mt-1 bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded font-black tracking-wider uppercase inline-block">
                        {user.role}
                      </span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4 text-neutral-400" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white transition-colors"
                      >
                        <Settings className="h-4 w-4 text-neutral-400" />
                        <span>Account Settings</span>
                      </Link>
                      {user.role.toLowerCase() === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-white/5 text-yellow-500 hover:text-yellow-450 transition-colors"
                        >
                          <ChevronDown className="h-4 w-4 rotate-90 text-yellow-500" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-neutral-850 p-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-left cursor-pointer font-bold"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className="bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-xl border border-white/10 text-xs transition-all active:scale-95"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs transition-all active:scale-95"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
 
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-300 hover:text-yellow-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-neutral-950/95 border-t border-neutral-900 px-2 pt-2 pb-4 space-y-1 backdrop-blur-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-yellow-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="border-t border-neutral-900 pt-2 mt-2 px-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5 px-3 py-2 bg-neutral-900 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-600 text-neutral-950 font-bold text-xs flex items-center justify-center">
                    {getInitials(user.full_name)}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">{user.full_name}</span>
                    <span className="text-xs text-neutral-500 block truncate">{user.email}</span>
                  </div>
                </div>
                <div className="space-y-1 pl-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-neutral-900 text-neutral-300"
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                  {user.role.toLowerCase() === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-neutral-900 text-yellow-500"
                    >
                      <ChevronDown className="h-4 w-4 rotate-90 text-yellow-500" />
                      <span>Admin Console</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-red-500/10 text-red-400 text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-white/5 hover:bg-white/10 text-white font-semibold py-2 rounded-xl border border-white/10 text-sm transition-all"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-2 rounded-xl text-sm transition-all"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
