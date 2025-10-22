import { useEffect, useState } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';
import { FaMapMarkedAlt, FaCloudSunRain, FaListUl, FaInfoCircle } from 'react-icons/fa';
import { MdLocationOff } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

import { WeatherPopupContent } from '@components/weather/WeatherDisplay';
import { Footer } from '@utils/footer';
import { Header } from '@utils/header';

const SITE_MAP = [
  {
    text: 'Map',
    path: '/map',
    icon: (
      <FaMapMarkedAlt className="mb-3 text-4xl text-blue-400 transition-colors duration-300 group-hover:text-cyan-300" />
    ),
    description: 'Interactive weather maps with various layers',
  },
  {
    text: 'Weather',
    path: '/weather',
    icon: (
      <FaCloudSunRain className="mb-3 text-4xl text-yellow-400 transition-colors duration-300 group-hover:text-cyan-300" />
    ),
    description: 'Detailed weather forecasts and conditions',
  },
  {
    text: 'Recommendations',
    path: '/recommendations',
    icon: (
      <FaListUl className="mb-3 text-4xl text-green-400 transition-colors duration-300 group-hover:text-cyan-300" />
    ),
    description: 'Weather-based beach recommendations',
  },
  {
    text: 'About',
    path: '/about',
    icon: (
      <FaInfoCircle className="mb-3 text-4xl text-purple-400 transition-colors duration-300 group-hover:text-cyan-300" />
    ),
    description: 'Learn more about Worther',
  },
];

const FEATURES = [
  {
    title: 'Accurate Forecasts',
    color: 'text-yellow-400',
    description: 'Get detailed 3-hour and daily weather forecasts with all the metrics you need.',
  },
  {
    title: 'Interactive Maps',
    color: 'text-green-400',
    description: 'Explore interactive weather maps with multiple layers and real-time updates.',
  },
  {
    title: 'Weather Recommendations',
    color: 'text-purple-400',
    description: 'Receive personalized recommendations based on current and forecasted weather.',
  },
  {
    title: 'Location Awareness',
    color: 'text-pink-400',
    description: 'Quickly access weather data for your current location with a single click.',
  },
];

const FeatureCard = ({ title, color, description }) => (
  <div className="rounded-lg border border-gray-800/50 bg-black/40 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-gray-700/50">
    <h3 className={`text-lg font-bold ${color} mb-2`}>{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default function Home() {
  const [userPos, setUserPos] = useState({ latitude: undefined, longitude: undefined });
  const [currentDate, setCurrentDate] = useState('');
  const [locationStatus, setLocationStatus] = useState('loading'); // 'loading', 'denied', 'unavailable', 'available'
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Worther - Home';

    // Get current date in a nice format
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));

    // Get user location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setUserPos({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLocationStatus('available');
        },
        err => {
          console.error(`ERROR(${err.code}): ${err.message}`);
          setLocationStatus(err.code === 1 ? 'denied' : 'unavailable');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased from 5000 to 15000 for better reliability
          maximumAge: 0,
        }
      );
    } else {
      setLocationStatus('unavailable');
    }
  }, []);

  function handleViewWeatherDetails() {
    if (userPos.latitude && userPos.longitude) {
      navigate(`/weatherLocation/${userPos.latitude}/${userPos.longitude}`);
    } else {
      navigate('/weather');
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black text-white">
      <Header />
      <main className="flex grow flex-col items-center justify-start px-4 pt-8 md:px-6 md:pt-12">
        {/* Hero section */}
        <section className="mb-10 text-center md:mb-14">
          <h1 className="animate-text bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent uppercase md:text-8xl">
            Worther
          </h1>
          <p className="mt-3 text-xl font-light text-sky-400 uppercase md:mt-5 md:text-4xl">
            Getting weather closer to you
          </p>
          <p className="mt-2 text-gray-300 italic">{currentDate}</p>
        </section>

        {/* Location Loading Indicator */}
        {locationStatus === 'loading' && (
          <section className="mb-10 w-full max-w-md">
            <div className="rounded-xl border border-blue-900/50 bg-gradient-to-r from-blue-900/80 via-blue-950/80 to-blue-900/80 p-5 shadow-lg backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-3">
                <BiCurrentLocation className="animate-pulse text-2xl text-blue-400" />
                <h2 className="text-xl font-bold text-blue-300">Detecting Your Location...</h2>
              </div>
              <div
                className="flex items-center justify-center py-3"
                role="status"
                aria-live="polite"
              >
                <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-400"></div>
              </div>
              <p className="text-center text-gray-300">
                Please wait while we determine your location for local weather information
              </p>
            </div>
          </section>
        )}

        {/* Location Status Message */}
        {(locationStatus === 'denied' || locationStatus === 'unavailable') && (
          <section className="mb-10 w-full max-w-md">
            <div className="rounded-xl border border-red-900/50 bg-gradient-to-r from-red-900/80 via-red-950/80 to-red-900/80 p-5 shadow-lg backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-3">
                <MdLocationOff className="text-2xl text-red-400" />
                <h2 className="text-xl font-bold text-red-300">
                  {locationStatus === 'denied'
                    ? 'Location Access Denied'
                    : 'Location Not Available'}
                </h2>
              </div>
              <p className="text-gray-300">
                {locationStatus === 'denied'
                  ? 'You have denied location access. To see weather for your current location, please enable location services for this site in your browser settings.'
                  : 'Your device cannot determine your current location. You can still search for weather in specific locations.'}
              </p>
              <Link
                to="/weather"
                className="mt-3 flex w-full cursor-pointer justify-center rounded-md bg-gradient-to-r from-blue-700 to-blue-600 py-2 font-medium shadow-md transition-all hover:from-blue-600 hover:to-blue-500"
              >
                Go to Weather Search
              </Link>
            </div>
          </section>
        )}

        {/* Current Weather Widget */}
        {userPos.latitude && userPos.longitude && (
          <section className="mb-10 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
            <div className="rounded-xl border border-blue-900/50 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-sm">
              <h2 className="mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-center text-xl font-bold text-transparent">
                Your Current Weather
              </h2>
              <div className="rounded-lg bg-black/40 p-4 backdrop-blur-sm">
                <WeatherPopupContent userPos={userPos} />
                <button
                  onClick={handleViewWeatherDetails}
                  className="mt-3 w-full cursor-pointer rounded-md bg-gradient-to-r from-blue-700 to-blue-600 py-2.5 font-medium shadow-md transition-all hover:from-blue-600 hover:to-blue-500"
                >
                  View Full Forecast
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Navigation Cards */}
        <section className="mb-12 grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SITE_MAP.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="group flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gradient-to-br from-slate-900 to-gray-900 p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,128,255,0.2)]"
              aria-label={`Navigate to ${item.text}`}
            >
              {item.icon}
              <span className="mb-2 text-2xl font-bold">{item.text}</span>
              <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-200">
                {item.description}
              </p>
            </Link>
          ))}
        </section>

        {/* App Features */}
        <section className="relative mb-14 w-full max-w-4xl">
          <div className="absolute inset-0 rounded-full bg-blue-600/10 blur-3xl"></div>
          <div className="relative rounded-xl border border-blue-900/30 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 p-7 shadow-lg backdrop-blur-sm">
            <h2 className="mb-5 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-center text-2xl font-bold text-transparent">
              Why Use Worther?
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {FEATURES.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  color={feature.color}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
