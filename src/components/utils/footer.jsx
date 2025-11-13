import { BsGithub } from 'react-icons/bs';
import { FaDiscord } from 'react-icons/fa';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import Logo from '@resources/logo_transparent.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gradient-to-t from-slate-900/90 to-black/80 shadow-lg backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Worther logo" className="h-10 w-10 rounded opacity-90" />
              <span className="animate-text bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
                Worther
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">Getting weather closer to you</p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="mb-2 text-sm font-medium tracking-wider text-gray-300 uppercase">
              Quick Links
            </h3>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              <Link
                to="/"
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-cyan-300"
              >
                Home
              </Link>
              <Link
                to="/weather"
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-cyan-300"
              >
                Weather
              </Link>
              <Link
                to="/map"
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-cyan-300"
              >
                Map
              </Link>
              <Link
                to="/recommendations"
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-cyan-300"
              >
                Recommendations
              </Link>
              <Link
                to="/about"
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-cyan-300"
              >
                About
              </Link>
              <Link
                to="/settings"
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-cyan-300"
              >
                Settings
              </Link>
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="mb-2 text-sm font-medium tracking-wider text-gray-300 uppercase">
              Connect
            </h3>
            <div className="flex gap-4">
              <a
                className="transform text-gray-400 transition-all duration-200 hover:scale-110 hover:text-cyan-300"
                href="https://discord.gg/n6xr3ZWM8J"
                target="_blank"
                rel="noreferrer"
                aria-label="Join Discord server"
              >
                <FaDiscord size="24" />
              </a>
              <a
                className="transform text-gray-400 transition-all duration-200 hover:scale-110 hover:text-cyan-300"
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
        <div className="mt-6 flex flex-col items-center justify-between border-t border-slate-800 pt-5 sm:flex-row">
          <Link
            to="/changelog"
            className="mb-3 flex items-center gap-2 text-gray-400 transition-all duration-200 hover:text-cyan-300 sm:mb-0"
            aria-label="View changelog"
          >
            <IoDocumentTextSharp size="18" />
            <span className="text-sm">Changelog</span>
          </Link>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © {currentYear} Worther. All rights reserved.
              <a
                href="https://github.com/vikingnope/worther/blob/master/LICENSE.txt"
                target="_blank"
                rel="noreferrer"
                className="ml-1 text-gray-400 transition-colors duration-200 hover:text-cyan-300"
              >
                AGPL-3.0 License
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
