import '../styles/main.css';
import Home from './home.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './about.jsx';
import Weather from './weather.jsx';
import AdvancedWeather from './advancedWeather.jsx';
import { GetSingleWeather } from '../components/weatherSingle.jsx';
import { ThreeHourForecastData } from '../components/3HourForecastData.jsx';
import ShowMap from '../components/showMap';
import { SingleThreeHourForecastData } from '../components/Single3HourForecastData';
import Error from './error';
import Recommendations from './recommendations';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { DailyWeatherData } from '../components/dailyWeather';
import Changelog from './changelog.jsx';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/map/:mapType" element={<ShowMap />} />
          <Route exact path="/weather" element={<Weather />} />
          <Route exact path="/advancedWeather" element={<AdvancedWeather />} />
          <Route exact path="/weather/:city" element={<GetSingleWeather />} /> (// * Changes url according to city)
          <Route exact path="/weatherCountry/:countryCode/:city" element={<GetSingleWeather />} />
          <Route exact path="/weatherLocation/:latitude/:longitude" element={<GetSingleWeather/>} />
          <Route exact path="/3HourForecast/:lat/:lon" element={<ThreeHourForecastData />} />
          <Route exact path="/dailyWeather/:lat/:lon" element={<DailyWeatherData />} />
          <Route exact path="/Single3HourForecast/:index/:lat/:lon" element={<SingleThreeHourForecastData />} />
          <Route exact path="/recommendations" element={<Recommendations />} />
          <Route exact path="/changelog" element={<Changelog />} />
          <Route exact path="*" element={<Error />} /> (// * Displays error page, '*' is a wildcard to display when nothing else is found)
        </Routes>
      </Router>
      <Analytics />
      <SpeedInsights />
    </>
  );
}