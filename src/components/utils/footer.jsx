import { memo } from 'react';
import { BsGithub } from 'react-icons/bs';
import { FaDiscord } from 'react-icons/fa';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

export const Footer = memo(() => {
  return (
    <footer className="inset-x-0 bottom-0 h-12 w-full bg-gradient-to-b from-black to-slate-900 shadow-md">
      <nav className="relative flex h-full items-center justify-center gap-x-6">
        <a
          className="transform text-gray-200 transition-all duration-200 hover:scale-110 hover:text-cyan-300"
          href="https://discord.gg/n6xr3ZWM8J"
          target="_blank"
          rel="noreferrer"
          aria-label="Join Discord server"
        >
          <FaDiscord size="28" />
        </a>
        <a
          className="transform text-gray-200 transition-all duration-200 hover:scale-110 hover:text-cyan-300"
          href="https://github.com/vikingnope/worther"
          target="_blank"
          rel="noreferrer"
          aria-label="View GitHub repository"
        >
          <BsGithub size="28" />
        </a>
        <div className="absolute right-5">
          <Link
            to="/release-notes"
            className="flex items-center gap-x-2 font-medium text-gray-200 transition-colors duration-200 hover:text-cyan-300"
            aria-label="View release notes"
          >
            <IoDocumentTextSharp size="20" />
            <span className="underline underline-offset-2">Release Notes</span>
          </Link>
        </div>
      </nav>
    </footer>
  );
});

Footer.displayName = 'Footer';
