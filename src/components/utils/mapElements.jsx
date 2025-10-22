import { Activity, useEffect, useState } from 'react';
import { BsSliders } from 'react-icons/bs';
import { IoIosArrowBack } from 'react-icons/io';
import { IoClose, IoSearch, IoLayers } from 'react-icons/io5';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { PiSunHorizonBold } from 'react-icons/pi';
import { TbTemperature, TbWind, TbCloud, TbCloudRain, TbSatellite } from 'react-icons/tb';
import { useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

import useSettingsStore from '@stores/settingsStore';

/**
 * CustomZoomControl - A reusable component to style the Leaflet zoom controls
 *
 * @param {Object} props - Component props
 * @param {string} [props.theme='light'] - The map theme ('light' or 'dark')
 * @returns {null} - This component doesn't render anything visible, just applies styling
 */
export const CustomZoomControl = ({ theme = 'light' }) => {
  const map = useMap();

  useEffect(() => {
    // Find all zoom control elements and style them according to map type
    const zoomInButton = document.querySelector('.leaflet-control-zoom-in');
    const zoomOutButton = document.querySelector('.leaflet-control-zoom-out');
    const zoomContainer = document.querySelector('.leaflet-control-zoom');

    if (zoomInButton && zoomOutButton && zoomContainer) {
      // Apply styles to the container
      zoomContainer.style.border = 'none';
      zoomContainer.style.boxShadow =
        theme === 'light' ? '0 2px 10px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.4)';
      zoomContainer.style.borderRadius = '8px';
      zoomContainer.style.overflow = 'hidden';

      // Common styles for both buttons
      [zoomInButton, zoomOutButton].forEach(button => {
        button.style.transition = 'all 0.2s ease';
        button.style.border = 'none';
        button.style.width = '36px';
        button.style.height = '36px';
        button.style.lineHeight = '36px';
        button.style.fontSize = '18px';
        button.style.fontWeight = 'bold';

        // Hover effect
        button.onmouseover = () => {
          if (theme === 'light') {
            button.style.backgroundColor = '#f0f0f0';
          } else {
            button.style.backgroundColor = '#444';
          }
        };

        // Reset on mouseout
        button.onmouseout = () => {
          if (theme === 'light') {
            button.style.backgroundColor = '#fff';
          } else {
            button.style.backgroundColor = '#333';
          }
        };
      });

      // Apply theme-specific styles
      if (theme === 'light') {
        // Light mode styling
        zoomInButton.style.color = '#333';
        zoomInButton.style.backgroundColor = '#fff';
        zoomOutButton.style.color = '#333';
        zoomOutButton.style.backgroundColor = '#fff';
      } else {
        // Dark mode styling
        zoomInButton.style.color = '#f0f0f0';
        zoomInButton.style.backgroundColor = '#333';
        zoomOutButton.style.color = '#f0f0f0';
        zoomOutButton.style.backgroundColor = '#333';
      }
    }
  }, [theme, map]);

  return null; // This component doesn't render anything, just applies styling
};

/**
 * CustomAttributionControl - A reusable component to style the Leaflet attribution control
 *
 * @param {Object} props - Component props
 * @param {string} [props.theme='light'] - The map theme ('light' or 'dark')
 * @returns {null} - This component doesn't render anything visible, just applies styling
 */
export const CustomAttributionControl = ({ theme = 'light' }) => {
  const map = useMap();

  useEffect(() => {
    // Find attribution control element and style according to map type
    const attributionElement = document.querySelector('.leaflet-control-attribution');

    if (attributionElement) {
      // Apply common styles
      attributionElement.style.transition = 'all 0.2s ease';
      attributionElement.style.padding = '5px 8px';
      attributionElement.style.fontSize = '11px';
      attributionElement.style.lineHeight = '1.2';
      attributionElement.style.boxShadow =
        theme === 'light' ? '0 1px 5px rgba(0, 0, 0, 0.1)' : '0 1px 5px rgba(0, 0, 0, 0.4)';
      attributionElement.style.whiteSpace = 'nowrap';
      attributionElement.style.overflow = 'hidden';
      attributionElement.style.textOverflow = 'ellipsis';
      attributionElement.style.maxWidth = 'calc(100vw - 20px)';
      attributionElement.style.borderRadius = '8px 0 0 0';

      // Add hover behavior to show full text
      attributionElement.onmouseover = () => {
        attributionElement.style.whiteSpace = 'normal';
        attributionElement.style.maxWidth = '300px';
        attributionElement.style.zIndex = '1000';
      };

      attributionElement.onmouseout = () => {
        attributionElement.style.whiteSpace = 'nowrap';
        attributionElement.style.overflow = 'hidden';
        attributionElement.style.textOverflow = 'ellipsis';
        attributionElement.style.maxWidth = 'calc(100vw - 20px)';
      };

      // Improve links styling
      const links = attributionElement.querySelectorAll('a');
      links.forEach(link => {
        link.style.textDecoration = 'none';
        link.style.fontWeight = '500';
        link.style.transition = 'color 0.2s ease';

        if (theme === 'light') {
          link.style.color = '#0078A8';
        } else {
          link.style.color = '#6BB0FF';
        }

        // Add hover effect
        link.onmouseover = () => {
          if (theme === 'light') {
            link.style.color = '#005580';
          } else {
            link.style.color = '#99CCFF';
          }
        };

        link.onmouseout = () => {
          if (theme === 'light') {
            link.style.color = '#0078A8';
          } else {
            link.style.color = '#6BB0FF';
          }
        };
      });

      // Apply theme-specific styles
      if (theme === 'light') {
        // Light mode
        attributionElement.style.color = '#333';
        attributionElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      } else {
        // Dark mode
        attributionElement.style.color = '#e0e0e0';
        attributionElement.style.backgroundColor = 'rgba(40, 40, 40, 0.9)';
      }
    }
  }, [theme, map]);

  return null; // This component doesn't render anything, just applies styling
};

/**
 * OptionsMethod component handles the expanded menu content
 */
function OptionsMethod(props) {
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  // Get theme and setTheme from settings store instead of using local state
  const { theme, setTheme } = useSettingsStore();

  // Prevent map interaction when interacting with menu controls
  function preventMapInteraction(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Only stop propagation but allow default behavior (for slider dragging)
  function stopPropagationOnly(event) {
    event.stopPropagation();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (city?.trim()) {
      navigate('/weather/' + city.trim());
    }
  }

  function handleDayNightToggle() {
    // Toggle theme using settings store instead of navigation
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  function getLayerButtonClass(isActive) {
    const baseClasses =
      'flex items-center justify-center gap-2 w-full p-2 rounded-lg font-medium text-sm transition-all duration-200 border';

    if (props.mode === 'dark') {
      return isActive
        ? `${baseClasses} bg-blue-600 text-white shadow-md border-blue-700`
        : `${baseClasses} bg-neutral-700 text-gray-200 hover:bg-neutral-600 border-neutral-600`;
    } else {
      return isActive
        ? `${baseClasses} bg-blue-500 text-white shadow-md border-blue-500`
        : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300`;
    }
  }

  const inputClassName =
    props.mode === 'dark'
      ? 'w-full bg-neutral-800 border-b border-neutral-500 focus:border-blue-500 text-white p-2 pl-9 outline-none rounded-t-lg transition-all duration-200'
      : 'w-full bg-white border-b border-gray-300 focus:border-blue-500 text-black p-2 pl-9 outline-none rounded-t-lg transition-all duration-200';

  const inputContainerClass = 'relative mb-4';

  const rangeClassName =
    props.mode === 'dark'
      ? 'w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-neutral-700 to-blue-600 accent-blue-500'
      : 'w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-gray-300 to-blue-500 accent-blue-500';

  const rangeContainerClass =
    props.mode === 'dark'
      ? 'mb-5 p-4 bg-neutral-800 rounded-lg border border-neutral-700'
      : 'mb-5 p-4 bg-gray-100 rounded-lg';

  const sectionTitleClass =
    props.mode === 'dark'
      ? 'text-sm font-medium text-gray-300 mb-2'
      : 'text-sm font-medium text-gray-700 mb-2';

  const layerButtonsContainerClass = 'grid grid-cols-2 gap-2';

  return (
    <div
      className={props.className}
      id="menuOptions"
      onMouseMove={preventMapInteraction}
      onTouchMove={preventMapInteraction}
    >
      {/* Menu header with close button */}
      <div className="mb-4 flex items-center justify-between">
        <h2
          className={`text-lg font-semibold ${props.mode === 'dark' ? 'text-white' : 'text-gray-800'}`}
        >
          Map Options
        </h2>
        <button
          onClick={props.onClose}
          className={`rounded-full p-1 transition-colors ${
            props.mode === 'dark'
              ? 'bg-neutral-700 text-white hover:bg-neutral-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-label="Close menu"
        >
          <IoClose size="20" />
        </button>
      </div>

      {/* City search form */}
      <form onSubmit={handleSubmit}>
        <div className={inputContainerClass}>
          <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
            <IoSearch size="18" />
          </div>
          <input
            className={inputClassName}
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Search city..."
            aria-label="Search for city"
          />
        </div>
      </form>

      {/* Layer opacity control */}
      <div className={rangeContainerClass}>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="opacitySlider" className={sectionTitleClass}>
            <div className="flex items-center gap-1">
              <BsSliders />
              <span>Layer Opacity</span>
            </div>
          </label>
          <span
            className={
              props.mode === 'dark'
                ? 'text-sm font-medium text-white'
                : 'text-sm font-medium text-gray-700'
            }
          >
            {Math.round(props.layerOpacity * 100)}%
          </span>
        </div>
        <input
          className={rangeClassName}
          type="range"
          id="opacitySlider"
          value={100 * props.layerOpacity}
          min={0}
          max={100}
          onChange={e => props.onLayerOpacityChange?.(Number(e.target.value) / 100)}
          onMouseDown={stopPropagationOnly}
          onMouseMove={stopPropagationOnly}
          onTouchStart={stopPropagationOnly}
          onTouchMove={stopPropagationOnly}
          aria-label="Adjust layer opacity"
        />
      </div>

      {/* Weather layer toggles */}
      <div>
        <label htmlFor="mapLayersSection" className={sectionTitleClass}>
          <div className="mb-2 flex items-center gap-1">
            <IoLayers />
            <span>Map Layers</span>
          </div>
        </label>
        <div id="mapLayersSection" className={layerButtonsContainerClass}>
          <button
            onClick={() => props.onShowWindChange?.(!props.showWind)}
            className={getLayerButtonClass(props.showWind)}
            aria-label="Toggle wind layer"
            aria-pressed={props.showWind}
          >
            <TbWind size="18" />
            <span>Wind</span>
          </button>
          <button
            onClick={() => props.onShowTemperatureChange?.(!props.showTemperature)}
            className={getLayerButtonClass(props.showTemperature)}
            aria-label="Toggle temperature layer"
            aria-pressed={props.showTemperature}
          >
            <TbTemperature size="18" />
            <span>Temp</span>
          </button>
          <button
            onClick={() => props.onShowCloudChange?.(!props.showCloud)}
            className={getLayerButtonClass(props.showCloud)}
            aria-label="Toggle cloud layer"
            aria-pressed={props.showCloud}
          >
            <TbCloud size="18" />
            <span>Cloud</span>
          </button>
          <button
            onClick={() => props.onShowRainChange?.(!props.showRain)}
            className={getLayerButtonClass(props.showRain)}
            aria-label="Toggle rain layer"
            aria-pressed={props.showRain}
          >
            <TbCloudRain size="18" />
            <span>Rain</span>
          </button>
        </div>

        {/* Satellite layer (full width) */}
        <button
          onClick={() => props.onShowSatelliteChange?.(!props.showSatellite)}
          className={`${getLayerButtonClass(props.showSatellite)} mt-2`}
          aria-label="Toggle satellite layer"
          aria-pressed={props.showSatellite}
        >
          <TbSatellite size="18" />
          <span>Satellite</span>
        </button>

        {/* Day/Night layer (full width) */}
        <button
          onClick={() => props.onShowDayNightChange?.(!props.showDayNight)}
          className={`${getLayerButtonClass(props.showDayNight)} mt-2`}
          aria-label="Toggle day/night terminator"
          aria-pressed={props.showDayNight}
        >
          <PiSunHorizonBold size="18" />
          <span>Day/Night Line</span>
        </button>
      </div>

      {/* Day/Night mode toggle */}
      <div className="mt-4">
        <label htmlFor="dayNightToggle" className={sectionTitleClass}>
          <div className="mb-2 flex items-center gap-1">
            <PiSunHorizonBold />
            <span>Day/Night Mode</span>
          </div>
        </label>
        <button
          id="dayNightToggle"
          onClick={handleDayNightToggle}
          className={`flex w-full items-center justify-center gap-2 rounded-lg p-2 text-sm font-medium transition-all duration-200 ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-gray-800'} `}
          aria-label="Toggle day/night mode"
          aria-pressed={theme === 'dark'}
        >
          {theme === 'dark' ? <MdDarkMode size="18" /> : <MdOutlineLightMode size="18" />}
          <span>{theme === 'dark' ? 'Night' : 'Day'} Mode</span>
        </button>
      </div>
    </div>
  );
}

/**
 * MenuBar - A component that provides a menu for controlling map layers and options
 *
 * @param {Object} props - Component props
 * @param {string} props.mode - The current map mode ('light' or 'dark')
 * @param {boolean} props.showWindDir - Whether to show wind direction
 * @param {Function} props.onShowWindDirChange - Callback for toggling wind direction
 * @param {boolean} props.showSatellite - Whether to show satellite layer
 * @param {Function} props.onShowSatelliteChange - Callback for toggling satellite layer
 * @param {boolean} props.showRain - Whether to show rain layer
 * @param {Function} props.onShowRainChange - Callback for toggling rain layer
 * @param {boolean} props.showCloud - Whether to show cloud layer
 * @param {Function} props.onShowCloudChange - Callback for toggling cloud layer
 * @param {boolean} props.showWind - Whether to show wind layer
 * @param {Function} props.onShowWindChange - Callback for toggling wind layer
 * @param {boolean} props.showTemperature - Whether to show temperature layer
 * @param {Function} props.onShowTemperatureChange - Callback for toggling temperature layer
 * @param {boolean} props.showDayNight - Whether to show day/night terminator layer
 * @param {Function} props.onShowDayNightChange - Callback for toggling day/night terminator layer
 * @param {number} props.layerOpacity - The opacity level of map layers (0-1)
 * @param {Function} props.onLayerOpacityChange - Callback for changing layer opacity
 * @returns {JSX.Element} - The menu bar component
 */
export function MenuBar(props) {
  const [toggle, setToggle] = useState(false);

  const menuButtonClass = (() => {
    const baseClasses =
      'absolute flex items-center py-2 px-3 rounded-r-lg top-24 z-40 transition-all duration-300';

    return props.mode === 'dark'
      ? `${baseClasses} bg-neutral-800 text-white border-y-2 border-r-2 border-neutral-600 shadow-lg hover:bg-neutral-700`
      : `${baseClasses} bg-white text-gray-800 border-y-2 border-r-2 border-gray-300 shadow-lg hover:bg-gray-100`;
  })();

  const optionsContainerClass = (() => {
    const baseClasses =
      'absolute mt-24 z-40 w-72 p-4 rounded-lg shadow-lg transition-all duration-300';

    return props.mode === 'dark'
      ? `${baseClasses} bg-neutral-800 border border-neutral-600 text-white ml-3`
      : `${baseClasses} bg-white border border-gray-300 text-gray-800 ml-3`;
  })();

  function handleToggle() {
    setToggle(prev => !prev);
  }

  return (
    <div>
      <Activity mode={!toggle ? 'visible' : 'hidden'}>
        <button
          onClick={handleToggle}
          className={menuButtonClass}
          aria-label="Open map options"
          aria-expanded="false"
        >
          <IoIosArrowBack size="20" className="mr-1" />
          <span className="font-medium">Menu</span>
        </button>
      </Activity>

      <Activity mode={toggle ? 'visible' : 'hidden'}>
        <OptionsMethod
          mode={props.mode}
          showWindDir={props.showWindDir}
          onShowWindDirChange={props.onShowWindDirChange}
          showSatellite={props.showSatellite}
          onShowSatelliteChange={props.onShowSatelliteChange}
          showRain={props.showRain}
          onShowRainChange={props.onShowRainChange}
          showCloud={props.showCloud}
          onShowCloudChange={props.onShowCloudChange}
          showWind={props.showWind}
          onShowWindChange={props.onShowWindChange}
          showTemperature={props.showTemperature}
          onShowTemperatureChange={props.onShowTemperatureChange}
          showDayNight={props.showDayNight}
          onShowDayNightChange={props.onShowDayNightChange}
          layerOpacity={props.layerOpacity}
          onLayerOpacityChange={props.onLayerOpacityChange}
          onClose={handleToggle}
          className={optionsContainerClass}
          aria-expanded="true"
        />
      </Activity>
    </div>
  );
}
