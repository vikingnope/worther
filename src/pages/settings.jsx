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
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black text-white">
      <Header />
      <main className="flex grow flex-col items-center justify-start px-4 py-8 md:px-6 md:py-12">
        {/* Settings Header */}
        <section className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3">
            <IoMdSettings className="text-4xl text-cyan-400" />
            <h1 className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text pb-2 text-4xl font-bold text-transparent md:text-5xl">
              Settings
            </h1>
          </div>
          <p className="mt-2 text-gray-300">Customize your Worther experience</p>
        </section>

        {/* Settings Panel */}
        <div className="w-full max-w-2xl">
          <div className="rounded-xl border border-blue-900/50 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 shadow-lg backdrop-blur-sm">
            {/* Theme Setting */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-300">
                <div className="relative h-5 w-5">
                  <FaSun
                    className={`absolute top-0 left-0 ${theme === 'light' ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                  />
                  <FaMoon
                    className={`absolute top-0 left-0 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                  />
                </div>
                Theme
              </h2>
              <div className="rounded-lg border border-gray-800/50 bg-black/40 p-4 backdrop-blur-sm">
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
                      className={`cursor-pointer rounded-md border px-4 py-3 font-medium shadow-md transition-all ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-neutral-900 text-white'
                          : 'border-transparent bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaMoon />
                        Dark Mode
                      </div>
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`cursor-pointer rounded-md border px-4 py-3 font-medium shadow-md transition-all ${
                        theme === 'light'
                          ? 'border-transparent bg-white text-black'
                          : 'border-transparent bg-gray-800 text-gray-300 hover:bg-gray-700'
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
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-300">
                <FaRulerHorizontal />
                Measurement Units
              </h2>
              <div className="rounded-lg border border-gray-800/50 bg-black/40 p-4 backdrop-blur-sm">
                {/* Temperature Units */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 text-lg font-medium text-blue-300">
                    <FaThermometerHalf />
                    Temperature
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTemperatureUnit('celsius')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        temperatureUnit === 'celsius'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Celsius (°C)
                    </button>
                    <button
                      onClick={() => setTemperatureUnit('fahrenheit')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        temperatureUnit === 'fahrenheit'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Fahrenheit (°F)
                    </button>
                  </div>
                </div>

                {/* Distance Units */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 text-lg font-medium text-blue-300">
                    <FaRuler />
                    Distance
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDistanceUnit('km')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        distanceUnit === 'km'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Kilometers (km)
                    </button>
                    <button
                      onClick={() => setDistanceUnit('mi')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        distanceUnit === 'mi'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Miles (mi)
                    </button>
                  </div>
                </div>

                {/* Wind Speed Units */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 text-lg font-medium text-blue-300">
                    <FaWind />
                    Wind Speed
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSpeedUnit('kmh')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        speedUnit === 'kmh'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Kilometers per hour (km/h)
                    </button>
                    <button
                      onClick={() => setSpeedUnit('mph')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        speedUnit === 'mph'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Miles per hour (mph)
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSpeedUnit('ms')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        speedUnit === 'ms'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Meters per second (m/s)
                    </button>
                    <button
                      onClick={() => setSpeedUnit('knots')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        speedUnit === 'knots'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Knots (kn)
                    </button>
                  </div>
                </div>

                {/* Pressure Units */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2 text-lg font-medium text-blue-300">
                    <FaTachometerAlt />
                    Pressure
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPressureUnit('hPa')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        pressureUnit === 'hPa'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Hectopascals (hPa)
                    </button>
                    <button
                      onClick={() => setPressureUnit('mmHg')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        pressureUnit === 'mmHg'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Millimeters of Mercury (mmHg)
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPressureUnit('inHg')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        pressureUnit === 'inHg'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Inches of Mercury (inHg)
                    </button>
                    <button
                      onClick={() => setPressureUnit('psi')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        pressureUnit === 'psi'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Pounds per sq. inch (psi)
                    </button>
                  </div>
                </div>

                {/* Precipitation Units */}
                <div>
                  <div className="mb-3 flex items-center gap-2 text-lg font-medium text-blue-300">
                    <FaTint />
                    Precipitation
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPrecipitationUnit('mm')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        precipitationUnit === 'mm'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Millimeters (mm)
                    </button>
                    <button
                      onClick={() => setPrecipitationUnit('in')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        precipitationUnit === 'in'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-300">
                <FaClock />
                Time Format
              </h2>
              <div className="rounded-lg border border-gray-800/50 bg-black/40 p-4 backdrop-blur-sm">
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
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        timeFormat === '24h'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      24-hour (14:30)
                    </button>
                    <button
                      onClick={() => setTimeFormat('12h')}
                      className={`cursor-pointer rounded-md px-4 py-3 font-medium shadow-md transition-all ${
                        timeFormat === '12h'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-300">
                <FaMapMarkerAlt />
                Default Location
              </h2>
              <div className="rounded-lg border border-gray-800/50 bg-black/40 p-4 backdrop-blur-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      Current Default Location:{' '}
                      <span className="font-semibold text-white">
                        {defaultLocation || 'None set'}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={locationInput}
                      onChange={e => setLocationInput(e.target.value)}
                      placeholder="Enter city name or coordinates"
                      className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSaveLocation}
                      className="cursor-pointer rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-medium whitespace-nowrap shadow-md hover:from-blue-500 hover:to-blue-600"
                    >
                      Save Location
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Settings */}
            <div>
              <div className="rounded-lg border border-gray-800/50 bg-black/40 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-300">
                    <FaUndoAlt />
                    Reset all settings to default
                  </span>
                  <button
                    onClick={resetSettings}
                    className="cursor-pointer rounded-md bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 font-medium shadow-md transition-all hover:from-red-600 hover:to-red-500"
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
