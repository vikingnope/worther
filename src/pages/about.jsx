import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useEffect } from 'react';
import packageJson from '../../package.json';

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
    document.title = "Worther - About";
  }, []);

  const technologies = [
    { name: 'React', url: 'https://reactjs.org/' },
    { name: 'React Router', url: 'https://reactrouter.com/en/main' },
    { name: 'React Icons', url: 'https://react-icons.github.io/react-icons' },
    { name: 'React Leaflet', url: 'https://react-leaflet.js.org/' },
    { name: 'Axios', url: 'https://axios-http.com/docs/intro' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com/' }
  ];
  
  const apis = [
    { name: 'OpenStreetMap API', url: 'https://wiki.openstreetmap.org/wiki/API' },
    { name: 'Rainviewer API', url: 'https://www.rainviewer.com/api.html' },
    { name: 'OpenWeatherMap API', url: 'https://openweathermap.org/api' }
  ];
  
  return (
    <div className="flex flex-col min-h-screen text-white overflow-hidden bg-black">
      <Header/>
      <main className="flex flex-col md:items-center justify-center grow">
          <p className="uppercase font-bold md:text-7xl text-5xl md:mb-14 mt-8 md:mt-0">
            Welcome to Worther!
          </p>
          <p className="md:text-3xl text-2xl mt-8">
            The weather app with current weather of the whole world.
          </p>
          <p className="md:text-3xl text-2xl mt-8">
            Built using {technologies.map((tech, index) => (
              <span key={index}>
                <ExternalLink href={tech.url}>{tech.name}</ExternalLink>
                {index < technologies.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <p className="md:text-3xl text-2xl mt-8">
            APIs used: {apis.map((api, index) => (
              <span key={index}>
                <ExternalLink href={api.url}>{api.name}</ExternalLink>
                {index < apis.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <p className="md:absolute mt-5 text-base md:bottom-12 -bottom-2 left-1.5">
          <span className='underline'>Disclaimer:</span> Any location data used is only sent to the weather API when search by location is chosen, on the map it is only kept on the client side. Analytics are also sent to a server.
          </p>
          <p className="md:absolute text-base underline md:bottom-12 md:right-1.5 md:left-auto my-5 md:my-0">
            Version {packageJson.version}
          </p>
      </main>
      <Footer />
    </div>
  )
}
