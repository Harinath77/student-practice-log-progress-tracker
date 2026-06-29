import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Music4, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

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
            <NavLink to="/" className="flex items-center space-x-2 font-bold text-xl whitespace-nowrap">
              <Music4 className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              <span className="tracking-tight text-white font-extrabold">LEVELUXE</span>
            </NavLink>
          </div>
 
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5 flex-shrink-0">
            {isAuthenticated && user ? (
              user.role.toLowerCase() === 'admin' ? (
                /* Admin Navigation Links */
                <>
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                  >
                    <span className="whitespace-nowrap">Admin Dashboard</span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-neutral-350 hover:text-red-400 transition-colors duration-205 text-sm font-bold flex items-center space-x-1.5 cursor-pointer focus:outline-none whitespace-nowrap"
                  >
                    <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                /* Student Navigation Links */
                <>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                  >
                    <span className="whitespace-nowrap">Profile</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                  >
                    <span className="whitespace-nowrap">My Courses</span>
                  </NavLink>
                  <NavLink
                    to="/schedule"
                    className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                  >
                    <span className="whitespace-nowrap">Schedule</span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-neutral-350 hover:text-red-400 transition-colors duration-205 text-sm font-bold flex items-center space-x-1.5 cursor-pointer focus:outline-none whitespace-nowrap"
                  >
                    <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>Logout</span>
                  </button>
                </>
              )
            ) : (
              /* Guest Actions */
              <div className="flex items-center space-x-3 flex-shrink-0">
                <NavLink
                  to="/login"
                  className="bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-xl border border-white/10 text-xs transition-all active:scale-95 whitespace-nowrap"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs transition-all active:scale-95 whitespace-nowrap"
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
          {isAuthenticated && user ? (
            user.role.toLowerCase() === 'admin' ? (
              <>
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'bg-yellow-500/10 text-yellow-400' : 'text-neutral-300'
                    }`
                  }
                >
                  Admin Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-red-500/10 text-red-400 text-left cursor-pointer mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'bg-yellow-500/10 text-yellow-400' : 'text-neutral-300'
                    }`
                  }
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'bg-yellow-500/10 text-yellow-400' : 'text-neutral-300'
                    }`
                  }
                >
                  My Courses
                </NavLink>
                <NavLink
                  to="/schedule"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'bg-yellow-500/10 text-yellow-400' : 'text-neutral-300'
                    }`
                  }
                >
                  Schedule
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-red-500/10 text-red-400 text-left cursor-pointer mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )
          ) : (
            <div className="flex flex-col gap-2 p-2">
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
      )}
    </nav>
  );
};

export default Navbar;
