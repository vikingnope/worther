import '../styles/main.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"

// Lazy load all components
const Home = lazy(() => import('./home.jsx'));
const About = lazy(() => import('./about.jsx'));
const Weather = lazy(() => import('./weather.jsx'));
const GetSingleWeather = lazy(() => import('../components/weatherSingle.jsx').then(module => ({ default: module.GetSingleWeather })));
const ThreeHourForecastData = lazy(() => import('../components/3HourForecastData.jsx').then(module => ({ default: module.ThreeHourForecastData })));
const ShowMap = lazy(() => import('../components/showMap'));
const SingleThreeHourForecastData = lazy(() => import('../components/Single3HourForecastData').then(module => ({ default: module.SingleThreeHourForecastData })));
const ErrorPage = lazy(() => import('./error'));
const Recommendations = lazy(() => import('./recommendations'));
const DailyWeatherData = lazy(() => import('../components/dailyWeather').then(module => ({ default: module.DailyWeatherData })));
const Changelog = lazy(() => import('./changelog.jsx'));

export default function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<div className="text-white flex h-screen bg-black"></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/map/:mapType" element={<ShowMap />} />
            <Route path="/weather" element={<Weather />} />
            {/* Changes url according to city */}
            <Route path="/weather/:city" element={<GetSingleWeather />} />
            <Route path="/weatherCountry/:countryCode/:city" element={<GetSingleWeather />} />
            <Route path="/weatherLocation/:latitude/:longitude" element={<GetSingleWeather/>} />
            <Route path="/3HourForecast/:lat/:lon" element={<ThreeHourForecastData />} />
            <Route path="/dailyWeather/:lat/:lon" element={<DailyWeatherData />} />
            <Route path="/Single3HourForecast/:index/:lat/:lon" element={<SingleThreeHourForecastData />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/changelog" element={<Changelog />} />
            {/* Displays error page, '*' is a wildcard to display when nothing else is found */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </Router>
      <Analytics />
      <SpeedInsights />
    </>
  );
}