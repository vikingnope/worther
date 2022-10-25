import React from 'react';

const About = () => {
  return (
    <div>
      <header className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
            <p className="uppercase font-bold text-7xl mt-px">
              Welcome to Worther!
            </p>
            <p className="uppercase text-3xl mt-5">
              The weather app with the map of the world and wind direction.
            </p>
            <p className="text-3xl mt-5">
              It is built using React, Leaflet & Axios.
            </p>
            <p className="text-3xl mt-5">
              APIs used: OpenStreetMap API, Rainviewer API, EUMETSAT API
            </p>
            <a href="/" className="text-4xl uppercase font-bold text-white underline m-5">
              Home
            </a>
        </header>
    </div>
  )
}

export default About;