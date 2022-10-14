import '../styles/main.scss';
import Home from './home.jsx';
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './about.jsx';
import Contact from './contact.jsx';
import Map from './map.jsx';
import Weather from './weather.jsx';
import AdvancedWeather from './advancedWeather.jsx';
import { GetOpenWeatherData } from '../components/openWeatherData.jsx';
import { MultipleWeatherData } from '../components/multipleWeatherData.jsx';
import DarkMap from './darkMap';
import ShowMap from '../components/showMap';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/map" element={<Map />} />
        <Route exact path="/map/:mapType" element={<ShowMap />} />
        <Route exact path="/darkMap" element={<DarkMap />} />
        <Route exact path="/weather" element={<Weather />} />
        <Route exact path="/advancedWeather" element={<AdvancedWeather />} />
        <Route exact path="/weather/:city" element={<GetOpenWeatherData />} /> (// changes url according to city)
        <Route exact path="/weatherCountry/:countryCode/:city" element={<GetOpenWeatherData />} />
        <Route exact path="/weatherLocation/:latitude/:longitude" element={<GetOpenWeatherData/>} />
        <Route exact path="/weather/:city/:lat/:lon" element={<MultipleWeatherData />} />
      </Routes>
    </Router>
  );
}