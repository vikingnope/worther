import { Header } from '../components/utils/header';
import { Footer } from '../components/utils/footer';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WeatherPopupContent } from '../components/utils/weatherVariables';
import { FaMapMarkedAlt, FaCloudSunRain, FaListUl, FaInfoCircle } from 'react-icons/fa';

const SITE_MAP = [
    { text: 'Map', path: '/map/light', icon: <FaMapMarkedAlt className="text-4xl mb-3 text-blue-400 group-hover:text-cyan-300 transition-colors duration-300" />, description: 'Interactive weather maps with various layers' },
    { text: 'Weather', path: '/weather', icon: <FaCloudSunRain className="text-4xl mb-3 text-yellow-400 group-hover:text-cyan-300 transition-colors duration-300" />, description: 'Detailed weather forecasts and conditions' },
    { text: 'Recommendations', path: '/recommendations', icon: <FaListUl className="text-4xl mb-3 text-green-400 group-hover:text-cyan-300 transition-colors duration-300" />, description: 'Weather-based beach recommendations' },
    { text: 'About', path: '/about', icon: <FaInfoCircle className="text-4xl mb-3 text-purple-400 group-hover:text-cyan-300 transition-colors duration-300" />, description: 'Learn more about Worther' }
];

export default function Home() {
    const [userPos, setUserPos] = useState({ latitude: undefined, longitude: undefined });
    const [currentDate, setCurrentDate] = useState('');
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
                },
                (err) => {
                    console.error(`ERROR(${err.code}): ${err.message}`);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
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
                            <div className="bg-black/40 p-5 rounded-lg backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/50 transition-colors duration-300">
                                <h3 className="font-bold text-lg text-yellow-400 mb-2">Accurate Forecasts</h3>
                                <p className="text-gray-300">Get detailed 3-hour and daily weather forecasts with all the metrics you need.</p>
                            </div>
                            <div className="bg-black/40 p-5 rounded-lg backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/50 transition-colors duration-300">
                                <h3 className="font-bold text-lg text-green-400 mb-2">Interactive Maps</h3>
                                <p className="text-gray-300">Explore interactive weather maps with multiple layers and real-time updates.</p>
                            </div>
                            <div className="bg-black/40 p-5 rounded-lg backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/50 transition-colors duration-300">
                                <h3 className="font-bold text-lg text-purple-400 mb-2">Weather Recommendations</h3>
                                <p className="text-gray-300">Receive personalized recommendations based on current and forecasted weather.</p>
                            </div>
                            <div className="bg-black/40 p-5 rounded-lg backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/50 transition-colors duration-300">
                                <h3 className="font-bold text-lg text-pink-400 mb-2">Location Awareness</h3>
                                <p className="text-gray-300">Quickly access weather data for your current location with a single click.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}