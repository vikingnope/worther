import { memo } from 'react';
import { BsGithub } from 'react-icons/bs';
import { FaDiscord } from 'react-icons/fa';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import Logo from '@resources/logo_transparent.png';

export const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-slate-900/90 to-black/80 backdrop-blur-sm shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-6">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Worther logo" className="w-10 h-10 rounded opacity-90" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text animate-text">
                Worther
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Getting weather closer to you</p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-gray-300 font-medium mb-2 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              <Link
                to="/"
                className="text-gray-400 hover:text-cyan-300 text-sm transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/weather"
                className="text-gray-400 hover:text-cyan-300 text-sm transition-colors duration-200"
              >
                Weather
              </Link>
              <Link
                to="/map"
                className="text-gray-400 hover:text-cyan-300 text-sm transition-colors duration-200"
              >
                Map
              </Link>
              <Link
                to="/recommendations"
                className="text-gray-400 hover:text-cyan-300 text-sm transition-colors duration-200"
              >
                Recommendations
              </Link>
              <Link
                to="/about"
                className="text-gray-400 hover:text-cyan-300 text-sm transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/settings"
                className="text-gray-400 hover:text-cyan-300 text-sm transition-colors duration-200"
              >
                Settings
              </Link>
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-gray-300 font-medium mb-2 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex gap-4">
              <a
                className="text-gray-400 hover:text-cyan-300 transition-all duration-200 transform hover:scale-110"
                href="https://discord.gg/n6xr3ZWM8J"
                target="_blank"
                rel="noreferrer"
                aria-label="Join Discord server"
              >
                <FaDiscord size="24" />
              </a>
              <a
                className="text-gray-400 hover:text-cyan-300 transition-all duration-200 transform hover:scale-110"
                href="https://github.com/vikingnope/worther"
                target="_blank"
                rel="noreferrer"
                aria-label="View GitHub repository"
              >
                <BsGithub size="22" />
              </a>
            </div>
          </div>
        </div>

        {/* Changelog and Copyright */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center">
          <Link
            to="/changelog"
            className="text-gray-400 hover:text-cyan-300 transition-all duration-200 mb-3 sm:mb-0 flex items-center gap-2"
            aria-label="View changelog"
          >
            <IoDocumentTextSharp size="18" />
            <span className="text-sm">Changelog</span>
          </Link>
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              © {currentYear} Worther. All rights reserved.
              <a
                href="https://github.com/vikingnope/worther/blob/master/LICENSE.txt"
                target="_blank"
                rel="noreferrer"
                className="ml-1 text-gray-400 hover:text-cyan-300 transition-colors duration-200"
              >
                AGPL-3.0 License
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
