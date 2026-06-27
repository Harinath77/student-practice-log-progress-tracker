import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Music } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Instructors', path: '/instructors' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Contact', path: '/contact' },
  ];

  const activeStyle = "text-yellow-400 border-b-2 border-yellow-500 font-bold px-1 py-1.5 text-sm";
  const inactiveStyle = "text-neutral-300 hover:text-yellow-400 transition-colors duration-200 px-1 py-1.5 text-sm";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-neutral-950/80 backdrop-blur-md shadow-lg border-b border-neutral-900/60 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-10 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2 font-bold text-xl">
              <Music className="h-6 w-6 text-yellow-500" />
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
