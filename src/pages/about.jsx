import React from 'react';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { isDesktop } from 'react-device-detect';

export default function About() {
  document.title = "Worther - About";
  
  return (
    <div className="select-none text-white">
      <Header choice={'about'}/>
      <main className="bg-black flex flex-col items-center justify-center h-screen">
          {(isDesktop) ?
          <>
            <p className="uppercase font-bold text-7xl mt-px">
              Welcome to Worther!
            </p>
            <p className="uppercase text-3xl mt-8">
              The weather app with the map of the world and current real time weather.
            </p>
            <p className="text-3xl mt-8">
              Built using <a href="https://reactjs.org/" className="underline font-bold">React</a>, <a href="https://reactrouter.com/en/main" className="underline font-bold">React Router</a>, <a href="https://react-icons.github.io/react-icons" className="underline font-bold">React Icons</a>, <a href="https://react-leaflet.js.org/" className="underline font-bold">React Leaflet</a>, <a href="https://axios-http.com/docs/intro" className="underline font-bold">Axios</a>, & <a href="https://tailwindcss.com/" className="underline font-bold">Tailwind CSS</a>.
            </p>
            <p className="text-3xl mt-8">
              APIs used: <a href="https://wiki.openstreetmap.org/wiki/API" className="underline font-bold">OpenStreetMap API</a>, <a href="https://www.rainviewer.com/api.html" className="underline font-bold">Rainviewer API</a>, <a href="https://openweathermap.org/api" className="underline font-bold">OpenWeatherMap API</a>
            </p>
            <p className="absolute text-base underline -bottom-12 left-1.5">
              Disclaimer: Any location data used is only on client-side and is not sent to any server outside of client's network.
            </p>
            <p className="absolute text-base underline -bottom-12 right-1.5">
              Version 1.0.0
            </p>
          </> :
          <>
            <p className="uppercase font-bold text-5xl mt-px">
              Welcome to Worther!
            </p>
            <p className="uppercase text-2xl mt-8">
              The weather app with the map of the world and current real time weather.
            </p>
            <p className="text-2xl mt-8">
              Built using <a href="https://reactjs.org/" className="underline font-bold">React</a>, <a href="https://reactrouter.com/en/main" className="underline font-bold">React Router</a>, <a href="https://react-icons.github.io/react-icons" className="underline font-bold">React Icons</a>, <a href="https://react-leaflet.js.org/" className="underline font-bold">React Leaflet</a>, <a href="https://axios-http.com/docs/intro" className="underline font-bold">Axios</a>, & <a href="https://tailwindcss.com/" className="underline font-bold">Tailwind CSS</a>.
            </p>
            <p className="text-2xl mt-8">
              APIs used: <a href="https://wiki.openstreetmap.org/wiki/API" className="underline font-bold">OpenStreetMap API</a>, <a href="https://www.rainviewer.com/api.html" className="underline font-bold">Rainviewer API</a>, <a href="https://openweathermap.org/api" className="underline font-bold">OpenWeatherMap API</a>
            </p>
            <p className="absolute text-base underline -bottom-2 left-1.5">
              Disclaimer: Any location data used is only on client-side and is not sent to any server outside of client's network.
            </p>
            <p className="absolute text-base underline -bottom-12 left-1.5">
              Version 1.0.0
            </p>
          </>
        }
      </main>
      <Footer />
    </div>
  )
}
