import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import packageJson from '../../package.json';
import { Footer } from '../components/utils/footer';
import { Header } from '../components/utils/header';

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      className="underline duration-300 font-bold hover:text-cyan-300"
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
    <div className="flex flex-col min-h-screen text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black">
      <Header />
      <main className="flex flex-col items-center justify-center grow px-6 md:px-12 py-10">
        <div className="max-w-4xl w-full backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-lg border border-gray-800">
          <h1 className="uppercase font-bold text-5xl md:text-7xl mb-8 text-center bg-gradient-to-r from-cyan-300 to-blue-500 text-transparent bg-clip-text">
            Welcome to Worther!
          </h1>

          <p className="text-xl md:text-3xl my-8 text-center leading-relaxed">
            The weather app with current weather of the whole world.
          </p>

          <div className="mt-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-300">Built with</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink href={tech.url}>{tech.name}</ExternalLink>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-300">APIs used</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {apis.map((api, index) => (
                <span
                  key={index}
                  className="bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink href={api.url}>{api.name}</ExternalLink>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-4xl w-full flex flex-col md:flex-row justify-between text-sm text-gray-300">
          <p className="p-4 bg-black/30 rounded-lg backdrop-blur-sm border border-gray-800">
            <span className="font-semibold text-cyan-300">Disclaimer:</span> Any location data used
            is only sent to the weather API when search by location is chosen, on the map it is only
            kept on the client side. Analytics are also sent to a server.
          </p>
          <p className="mt-4 md:mt-0 p-4 bg-black/30 rounded-lg backdrop-blur-sm border border-gray-800 text-center">
            Version{' '}
            <Link to="/changelog" className="text-cyan-300 font-semibold underline">
              {packageJson.version}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
