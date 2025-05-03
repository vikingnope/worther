import { useEffect, useState } from 'react';
import {
  FaSun,
  FaMoon,
  FaRulerHorizontal,
  FaUndoAlt,
  FaClock,
  FaWind,
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaTachometerAlt,
  FaRuler,
  FaTint,
} from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

import useSettingsStore from '@stores/settingsStore';
import { Footer } from '@utils/footer';
import { Header } from '@utils/header';

export default function Settings() {
  const {
    theme,
    temperatureUnit,
    distanceUnit,
    speedUnit,
    pressureUnit,
    precipitationUnit,
    timeFormat,
    defaultLocation,
    setTheme,
    setTemperatureUnit,
    setDistanceUnit,
    setSpeedUnit,
    setPressureUnit,
    setPrecipitationUnit,
    setTimeFormat,
    setDefaultLocation,
    resetSettings,
  } = useSettingsStore();

  const [locationInput, setLocationInput] = useState(defaultLocation);

  useEffect(() => {
    setLocationInput(defaultLocation);
  }, [defaultLocation]);

  useEffect(() => {
    document.title = 'Worther - Settings';
  }, []);

  const handleSaveLocation = () => {
    setDefaultLocation(locationInput);
  };

  return (
    <div className="flex flex-col min-h-screen text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black">
      <Header />
      <main className="grow flex flex-col items-center justify-start py-8 md:py-12 px-4 md:px-6">
        {/* Settings Header */}
        <section className="text-center mb-10">
          <div className="flex items-center justify-center gap-3">
            <IoMdSettings className="text-4xl text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 pb-2">
              Settings
            </h1>
          </div>
          <p className="text-gray-300 mt-2">Customize your Worther experience</p>
        </section>

        {/* Settings Panel */}
        <div className="w-full max-w-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl p-6 border border-blue-900/50 shadow-lg backdrop-blur-sm">
            {/* Theme Setting */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <div className="relative w-5 h-5">
                  <FaSun
                    className={`absolute left-0 top-0 ${theme === 'light' ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                  />
                  <FaMoon
                    className={`absolute left-0 top-0 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                  />
                </div>
                Theme
              </h2>
              <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-gray-800/50">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      Current Theme:{' '}
                      <span className="font-semibold text-white capitalize">{theme}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all border cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-neutral-900 text-white border-gray-600'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaMoon />
                        Dark Mode
                      </div>
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all border cursor-pointer ${
                        theme === 'light'
                          ? 'bg-white text-black border-transparent'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaSun />
                        Light Mode
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Units Settings - All consolidated in one section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <FaRulerHorizontal />
                Measurement Units
              </h2>
              <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-gray-800/50">
                {/* Temperature Units */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-lg font-medium text-blue-300 mb-3">
                    <FaThermometerHalf />
                    Temperature
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTemperatureUnit('celsius')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        temperatureUnit === 'celsius'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Celsius (°C)
                    </button>
                    <button
                      onClick={() => setTemperatureUnit('fahrenheit')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        temperatureUnit === 'fahrenheit'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Fahrenheit (°F)
                    </button>
                  </div>
                </div>

                {/* Distance Units */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-lg font-medium text-blue-300 mb-3">
                    <FaRuler />
                    Distance
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDistanceUnit('km')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        distanceUnit === 'km'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Kilometers (km)
                    </button>
                    <button
                      onClick={() => setDistanceUnit('mi')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        distanceUnit === 'mi'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Miles (mi)
                    </button>
                  </div>
                </div>

                {/* Wind Speed Units */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-lg font-medium text-blue-300 mb-3">
                    <FaWind />
                    Wind Speed
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <button
                      onClick={() => setSpeedUnit('kmh')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        speedUnit === 'kmh'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Kilometers per hour (km/h)
                    </button>
                    <button
                      onClick={() => setSpeedUnit('mph')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        speedUnit === 'mph'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Miles per hour (mph)
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSpeedUnit('ms')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        speedUnit === 'ms'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Meters per second (m/s)
                    </button>
                    <button
                      onClick={() => setSpeedUnit('knots')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        speedUnit === 'knots'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Knots (kn)
                    </button>
                  </div>
                </div>

                {/* Pressure Units */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-lg font-medium text-blue-300 mb-3">
                    <FaTachometerAlt />
                    Pressure
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <button
                      onClick={() => setPressureUnit('hPa')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        pressureUnit === 'hPa'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Hectopascals (hPa)
                    </button>
                    <button
                      onClick={() => setPressureUnit('mmHg')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        pressureUnit === 'mmHg'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Millimeters of Mercury (mmHg)
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPressureUnit('inHg')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        pressureUnit === 'inHg'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Inches of Mercury (inHg)
                    </button>
                    <button
                      onClick={() => setPressureUnit('psi')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        pressureUnit === 'psi'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Pounds per sq. inch (psi)
                    </button>
                  </div>
                </div>

                {/* Precipitation Units */}
                <div>
                  <div className="flex items-center gap-2 text-lg font-medium text-blue-300 mb-3">
                    <FaTint />
                    Precipitation
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPrecipitationUnit('mm')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        precipitationUnit === 'mm'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Millimeters (mm)
                    </button>
                    <button
                      onClick={() => setPrecipitationUnit('in')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        precipitationUnit === 'in'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Inches (in)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Format Setting */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <FaClock />
                Time Format
              </h2>
              <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-gray-800/50">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      Current Format:{' '}
                      <span className="font-semibold text-white">
                        {timeFormat === '24h' ? '24-hour' : '12-hour'}
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTimeFormat('24h')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        timeFormat === '24h'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      24-hour (14:30)
                    </button>
                    <button
                      onClick={() => setTimeFormat('12h')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        timeFormat === '12h'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      12-hour (2:30 PM)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Default Location Setting */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt />
                Default Location
              </h2>
              <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-gray-800/50">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      Current Default Location:{' '}
                      <span className="font-semibold text-white">
                        {defaultLocation || 'None set'}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={locationInput}
                      onChange={e => setLocationInput(e.target.value)}
                      placeholder="Enter city name or coordinates"
                      className="flex-1 px-4 py-3 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleSaveLocation}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md font-medium shadow-md cursor-pointer whitespace-nowrap"
                    >
                      Save Location
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Settings */}
            <div>
              <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-gray-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 flex items-center gap-2">
                    <FaUndoAlt />
                    Reset all settings to default
                  </span>
                  <button
                    onClick={resetSettings}
                    className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 transition-all rounded-md font-medium shadow-md cursor-pointer"
                  >
                    Reset Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
