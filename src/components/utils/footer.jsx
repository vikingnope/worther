import { FaDiscord } from 'react-icons/fa';
import { BsGithub } from 'react-icons/bs';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { memo } from 'react';
import { Link } from 'react-router-dom';

export const Footer = memo(() => {
  return (
    <footer className="inset-x-0 bottom-0 bg-gradient-to-b from-black to-slate-900 h-12 w-full shadow-md">
      <nav className="relative flex h-full gap-x-6 justify-center items-center">
        <a
          className="text-gray-200 hover:text-cyan-300 transform hover:scale-110 transition-all duration-200"
          href="https://discord.gg/n6xr3ZWM8J"
          target="_blank"
          rel="noreferrer"
          aria-label="Join Discord server"
        >
          <FaDiscord size="28" />
        </a>
        <a
          className="text-gray-200 hover:text-cyan-300 transform hover:scale-110 transition-all duration-200"
          href="https://github.com/vikingnope/worther"
          target="_blank"
          rel="noreferrer"
          aria-label="View GitHub repository"
        >
          <BsGithub size="28" />
        </a>
        <div className="absolute right-5">
          <Link
            to="/changelog"
            className="font-medium text-gray-200 hover:text-cyan-300 flex gap-x-2 items-center transition-colors duration-200"
            aria-label="View changelog"
          >
            <IoDocumentTextSharp size="20" />
            <span className="underline underline-offset-2">Changelog</span>
          </Link>
        </div>
      </nav>
    </footer>
  );
});

Footer.displayName = 'Footer';
