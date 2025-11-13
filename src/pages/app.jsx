import '@styles/main.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Lazy load all components
const Home = lazy(() => import('@pages/home.jsx'));
const About = lazy(() => import('@pages/about.jsx'));
const Weather = lazy(() => import('@pages/weather.jsx'));
const GetSingleWeather = lazy(() =>
  import('@components/weatherSingle.jsx').then(module => ({ default: module.GetSingleWeather }))
);
const ThreeHourForecastData = lazy(() =>
  import('@components/3HourForecastData.jsx').then(module => ({
    default: module.ThreeHourForecastData,
  }))
);
const ShowMap = lazy(() => import('@pages/map.jsx'));
const SingleThreeHourForecastData = lazy(() =>
  import('@components/Single3HourForecastData.jsx').then(module => ({
    default: module.SingleThreeHourForecastData,
  }))
);
const ErrorPage = lazy(() => import('@pages/error.jsx'));
const Recommendations = lazy(() => import('@pages/recommendations.jsx'));
const DailyWeatherData = lazy(() =>
  import('@components/dailyWeather.jsx').then(module => ({ default: module.DailyWeatherData }))
);
const Changelog = lazy(() => import('@pages/changelog.jsx'));
const Settings = lazy(() => import('@pages/settings.jsx'));

export default function App() {
  return (
    <>
      <Router>
        <Suspense
          fallback={
            <div className="flex h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white"></div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/map" element={<ShowMap />} />
            <Route path="/weather" element={<Weather />} />
            {/* Changes url according to city */}
            <Route path="/weather/:city" element={<GetSingleWeather />} />
            <Route path="/weatherCountry/:countryCode/:city" element={<GetSingleWeather />} />
            <Route path="/weatherLocation/:latitude/:longitude" element={<GetSingleWeather />} />
            <Route path="/3HourForecast/:lat/:lon" element={<ThreeHourForecastData />} />
            <Route path="/dailyWeather/:lat/:lon" element={<DailyWeatherData />} />
            <Route
              path="/Single3HourForecast/:index/:lat/:lon"
              element={<SingleThreeHourForecastData />}
            />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/settings" element={<Settings />} />
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
