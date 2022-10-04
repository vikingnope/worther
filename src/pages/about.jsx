import React from 'react';
import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';

export default function About() {
  document.title = "Worther - About";
  
  return (
    <div className="select-none text-white">
      <Header choice={'about'}/>
      <main className="bg-black flex flex-col items-center justify-center h-screen">
          <p className="uppercase font-bold text-7xl mt-px">
            Welcome to Worther!
          </p>
          <p className="uppercase text-3xl mt-5">
            The weather app with the map of the world and wind direction.
          </p>
          <p className="text-3xl mt-5">
            It is built using React, Leaflet, Axios, Material UI & Tailwind CSS.
          </p>
          <p className="text-3xl mt-5">
            APIs used: OpenStreetMap API, Rainviewer API, EUMETSAT API, OpenWeatherMap API
          </p>
          <p className="absolute text-base underline bottom-11 right-1">
            Version 1.1.0
          </p>
      </main>
      <Footer />
    </div>
  )
}
