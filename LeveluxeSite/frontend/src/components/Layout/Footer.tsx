import React from 'react';
import { NavLink } from 'react-router-dom';
import { Music } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div className="space-y-4 text-left">
          <div className="flex items-center space-x-2 text-white font-bold text-lg">
            <Music className="h-6 w-6 text-yellow-500" />
            <span className="tracking-tight font-extrabold text-white">LEVELUXE</span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Elevating modern music education with premium curriculum, expert guidance, and state-of-the-art resources.
          </p>
        </div>

        {/* Links */}
        <div className="text-left">
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <NavLink to="/" className="hover:text-yellow-400 transition-colors duration-200">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/courses" className="hover:text-yellow-400 transition-colors duration-200">
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink to="/instructors" className="hover:text-yellow-400 transition-colors duration-200">
                Instructors
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="text-left">
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <NavLink to="/schedule" className="hover:text-yellow-400 transition-colors duration-200">
                Schedule
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-yellow-400 transition-colors duration-200">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-left">
          <h3 className="text-white font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: info@leveluxe.com</li>
            <li>Phone: +1 (555) 019-2834</li>
            <li>Address: 100 Rhythm Blvd, Sound City</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-neutral-900 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Leveluxe Modern Music Academy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
