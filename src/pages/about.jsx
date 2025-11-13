import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Footer } from '@utils/footer';
import { Header } from '@utils/header';

import packageJson from '../../package.json';

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      className="font-bold underline duration-300 hover:text-cyan-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default function About() {
  useEffect(() => {
    document.title = 'Worther - About';
  }, []);

  const technologies = [
    { name: 'React', url: 'https://reactjs.org/' },
    { name: 'React Router', url: 'https://reactrouter.com/en/main' },
    { name: 'React Icons', url: 'https://react-icons.github.io/react-icons' },
    { name: 'React Leaflet', url: 'https://react-leaflet.js.org/' },
    { name: 'Axios', url: 'https://axios-http.com/docs/intro' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com/' },
  ];

  const apis = [
    { name: 'OpenStreetMap API', url: 'https://wiki.openstreetmap.org/wiki/API' },
    { name: 'Rainviewer API', url: 'https://www.rainviewer.com/api.html' },
    { name: 'OpenWeatherMap API', url: 'https://openweathermap.org/api' },
  ];

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black text-white">
      <Header />
      <main className="flex grow flex-col items-center justify-center px-6 py-10 md:px-12">
        <div className="w-full max-w-4xl rounded-xl border border-gray-800 bg-black/30 p-8 shadow-lg backdrop-blur-sm">
          <h1 className="mb-8 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-center text-5xl font-bold text-transparent uppercase md:text-7xl">
            Welcome to Worther!
          </h1>

          <p className="my-8 text-center text-xl leading-relaxed md:text-3xl">
            The weather app with current weather of the whole world.
          </p>

          <div className="mt-12 mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-cyan-300 md:text-3xl">Built with</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-800 px-4 py-2 transition-colors hover:bg-gray-700"
                >
                  <ExternalLink href={tech.url}>{tech.name}</ExternalLink>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-cyan-300 md:text-3xl">APIs used</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {apis.map((api, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-800 px-4 py-2 transition-colors hover:bg-gray-700"
                >
                  <ExternalLink href={api.url}>{api.name}</ExternalLink>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-4xl flex-col justify-between text-sm text-gray-300 md:flex-row">
          <p className="rounded-lg border border-gray-800 bg-black/30 p-4 backdrop-blur-sm">
            <span className="font-semibold text-cyan-300">Disclaimer:</span> Any location data used
            is only sent to the weather API when search by location is chosen, on the map it is only
            kept on the client side. Analytics are also sent to a server.
          </p>
          <p className="mt-4 rounded-lg border border-gray-800 bg-black/30 p-4 text-center backdrop-blur-sm md:mt-0">
            Version{' '}
            <Link to="/changelog" className="font-semibold text-cyan-300 underline">
              {packageJson.version}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
