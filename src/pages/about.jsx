import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';

export default function About() {
  document.title = "Worther - About";

  const clickableTextStyling = 'underline duration-300 font-bold hover:text-cyan-300'
  
  return (
    <div className="text-white overflow-hidden">
      <Header choice={'about'}/>
      <main className="bg-black flex flex-col md:items-center justify-center h-screen">
          <p className="uppercase font-bold md:text-7xl text-5xl md:mb-14">
            Welcome to Worther!
          </p>
          <p className="md:text-3xl text-2xl mt-8">
            The weather app with current weather of the whole world.
          </p>
          <p className="md:text-3xl text-2xl mt-8">
            Built using <a href="https://reactjs.org/" className={clickableTextStyling}>React</a>, <a href="https://reactrouter.com/en/main" className={clickableTextStyling}>React Router</a>, <a href="https://react-icons.github.io/react-icons" className={clickableTextStyling}>React Icons</a>, <a href="https://react-leaflet.js.org/" className={clickableTextStyling}>React Leaflet</a>, <a href="https://axios-http.com/docs/intro" className={clickableTextStyling}>Axios</a>, & <a href="https://tailwindcss.com/" className={clickableTextStyling}>Tailwind CSS</a>.
          </p>
          <p className="md:text-3xl text-2xl mt-8">
            APIs used: <a href="https://wiki.openstreetmap.org/wiki/API" className={clickableTextStyling}>OpenStreetMap API</a>, <a href="https://www.rainviewer.com/api.html" className={clickableTextStyling}>Rainviewer API</a>, <a href="https://openweathermap.org/api" className={clickableTextStyling}>OpenWeatherMap API</a>
          </p>
          <p className="md:absolute mt-5 text-base md:-bottom-12 -bottom-2 left-1.5">
          <span className='underline'>Disclaimer:</span> Any location data used is only sent to the weather API when search by location is chosen, on the map it is only kept on the client side. Analytics are also sent to a server.
          </p>
          <p className="md:absolute text-base underline -bottom-12 md:right-1.5 md:left-auto mt-5">
            Version 1.0.7
          </p>
      </main>
      <Footer />
    </div>
  )
}
