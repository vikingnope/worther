import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WeatherPopupContent } from '../components/utils/weatherVariables';
import { FaMapMarkedAlt, FaCloudSunRain, FaListUl, FaInfoCircle } from 'react-icons/fa';
import { MdLocationOff } from "react-icons/md";
import { BiCurrentLocation } from "react-icons/bi";

const SITE_MAP = [
    { text: 'Map', path: '/map/light', icon: <FaMapMarkedAlt className="text-4xl mb-3 text-blue-400 group-hover:text-cyan-300 transition-colors duration-300" />, description: 'Interactive weather maps with various layers' },
    { text: 'Weather', path: '/weather', icon: <FaCloudSunRain className="text-4xl mb-3 text-yellow-400 group-hover:text-cyan-300 transition-colors duration-300" />, description: 'Detailed weather forecasts and conditions' },
    { text: 'Recommendations', path: '/recommendations', icon: <FaListUl className="text-4xl mb-3 text-green-400 group-hover:text-cyan-300 transition-colors duration-300" />, description: 'Weather-based beach recommendations' },
    { text: 'About', path: '/about', icon: <FaInfoCircle className="text-4xl mb-3 text-purple-400 group-hover:text-cyan-300 transition-colors duration-300" />, description: 'Learn more about Worther' }
];

const FEATURES = [
    { title: 'Accurate Forecasts', color: 'text-yellow-400', description: 'Get detailed 3-hour and daily weather forecasts with all the metrics you need.' },
    { title: 'Interactive Maps', color: 'text-green-400', description: 'Explore interactive weather maps with multiple layers and real-time updates.' },
    { title: 'Weather Recommendations', color: 'text-purple-400', description: 'Receive personalized recommendations based on current and forecasted weather.' },
    { title: 'Location Awareness', color: 'text-pink-400', description: 'Quickly access weather data for your current location with a single click.' }
];

const FeatureCard = ({ title, color, description }) => (
    <div className="bg-black/40 p-5 rounded-lg backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/50 transition-colors duration-300">
        <h3 className={`font-bold text-lg ${color} mb-2`}>{title}</h3>
        <p className="text-gray-300">{description}</p>
    </div>
);

export default function Home() {
    const [userPos, setUserPos] = useState({ latitude: undefined, longitude: undefined });
    const [currentDate, setCurrentDate] = useState('');
    const [locationStatus, setLocationStatus] = useState('loading'); // 'loading', 'denied', 'unavailable', 'available'
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Worther - Home";
        
        // Get current date in a nice format
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(date.toLocaleDateString('en-US', options));
        
        // Get user location if available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserPos({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    });
                    setLocationStatus('available');
                },
                (err) => {
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

    const handleViewWeatherDetails = useCallback(() => {
        if (userPos.latitude && userPos.longitude) {
            navigate(`/weatherLocation/${userPos.latitude}/${userPos.longitude}`);
        } else {
            navigate('/weather');
        }
    }, [navigate, userPos]);

    return (
        <div className='flex flex-col min-h-screen text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black'>
            <Header/>
            <main className="grow flex flex-col items-center justify-start pt-8 md:pt-12 px-4 md:px-6">
                {/* Hero section */}
                <section className="text-center mb-10 md:mb-14">
                    <h1 className="uppercase font-extrabold md:text-8xl text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 animate-text tracking-tight">
                        Worther
                    </h1>
                    <p className="uppercase md:text-4xl text-xl mt-3 md:mt-5 text-sky-400 font-light">
                        Getting weather closer to you
                    </p>
                    <p className="text-gray-300 mt-2 italic">
                        {currentDate}
                    </p>
                </section>
                
                {/* Location Loading Indicator */}
                {locationStatus === 'loading' && (
                    <section className="w-full max-w-md mb-10">
                        <div className="bg-gradient-to-r from-blue-900/80 via-blue-950/80 to-blue-900/80 rounded-xl shadow-lg p-5 border border-blue-900/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <BiCurrentLocation className="text-2xl text-blue-400 animate-pulse" />
                                <h2 className="text-xl font-bold text-blue-300">
                                    Detecting Your Location...
                                </h2>
                            </div>
                            <div className="flex items-center justify-center py-3">
                                <div className="w-10 h-10 border-t-2 border-b-2 border-blue-400 rounded-full animate-spin"></div>
                            </div>
                            <p className="text-gray-300 text-center">
                                Please wait while we determine your location for local weather information
                            </p>
                        </div>
                    </section>
                )}
                
                {/* Location Status Message */}
                {(locationStatus === 'denied' || locationStatus === 'unavailable') && (
                    <section className="w-full max-w-md mb-10">
                        <div className="bg-gradient-to-r from-red-900/80 via-red-950/80 to-red-900/80 rounded-xl shadow-lg p-5 border border-red-900/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <MdLocationOff className="text-2xl text-red-400" />
                                <h2 className="text-xl font-bold text-red-300">
                                    {locationStatus === 'denied' ? 'Location Access Denied' : 'Location Not Available'}
                                </h2>
                            </div>
                            <p className="text-gray-300">
                                {locationStatus === 'denied' 
                                    ? 'You have denied location access. To see weather for your current location, please enable location services for this site in your browser settings.'
                                    : 'Your device cannot determine your current location. You can still search for weather in specific locations.'}
                            </p>
                            <Link
                                to="/weather"
                                className="w-full mt-3 py-2 flex justify-center bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all rounded-md font-medium cursor-pointer shadow-md"
                            >
                                Go to Weather Search
                            </Link>
                        </div>
                    </section>
                )}
                
                {/* Current Weather Widget */}
                {userPos.latitude && userPos.longitude && (
                    <section className="w-full max-w-md mb-10 transform hover:scale-[1.02] transition-all duration-300">
                        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-5 border border-blue-900/50 backdrop-blur-sm">
                            <h2 className="text-xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Your Current Weather</h2>
                            <div className="bg-black/40 rounded-lg p-4 backdrop-blur-sm">
                                <WeatherPopupContent userPos={userPos} />
                                <button 
                                    onClick={handleViewWeatherDetails}
                                    className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all rounded-md font-medium cursor-pointer shadow-md"
                                >
                                    View Full Forecast
                                </button>
                            </div>
                        </div>
                    </section>
                )}
                
                {/* Navigation Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl mb-12">
                    {SITE_MAP.map((item, index) => (
                        <Link 
                            key={index} 
                            to={item.path} 
                            className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-gray-900 rounded-xl border border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,128,255,0.2)] transition-all duration-300 hover:-translate-y-1 text-center"
                            aria-label={`Navigate to ${item.text}`}
                        >
                            {item.icon}
                            <span className="font-bold text-2xl mb-2">{item.text}</span>
                            <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">{item.description}</p>
                        </Link>
                    ))}
                </section>
                
                {/* App Features */}
                <section className="w-full max-w-4xl mb-14 relative">
                    <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full"></div>
                    <div className="relative bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-xl p-7 border border-blue-900/30 shadow-lg backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-5 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Why Use Worther?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
    )
}