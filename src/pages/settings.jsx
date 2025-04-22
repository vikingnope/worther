import React, { useEffect } from 'react';
import { FaSun, FaMoon, FaRulerHorizontal, FaUndoAlt } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

import { Footer } from '../components/utils/footer';
import { Header } from '../components/utils/header';
import useSettingsStore from '../stores/settingsStore';

export default function Settings() {
  const { theme, units, setTheme, setUnits, resetSettings } = useSettingsStore();

  useEffect(() => {
    document.title = 'Worther - Settings';
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-white overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black">
      <Header />
      <main className="grow flex flex-col items-center justify-start pt-8 md:pt-12 px-4 md:px-6">
        {/* Settings Header */}
        <section className="text-center mb-10">
          <div className="flex items-center justify-center gap-3">
            <IoMdSettings className="text-4xl text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
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
                          ? 'bg-gray-950 text-white border-gray-600'
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

            {/* Units Setting */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <FaRulerHorizontal />
                Units
              </h2>
              <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-gray-800/50">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      Current Units:{' '}
                      <span className="font-semibold text-white capitalize">{units}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setUnits('metric')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        units === 'metric'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Metric (°C, km/h)
                    </button>
                    <button
                      onClick={() => setUnits('imperial')}
                      className={`px-4 py-3 rounded-md font-medium shadow-md transition-all cursor-pointer ${
                        units === 'imperial'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      Imperial (°F, mph)
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
