import { useState, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoClose, IoSearch, IoLayers } from 'react-icons/io5';
import { IoIosArrowBack } from 'react-icons/io';
import { TbTemperature, TbWind, TbCloud, TbCloudRain, TbSatellite } from 'react-icons/tb';
import { BsSliders } from 'react-icons/bs';

// OptionsMethod component handles the expanded menu content
const OptionsMethod = memo((props) => {
    const [city, setCity] = useState('');
    const navigate = useNavigate();

    // Prevent map interaction when interacting with menu controls
    const preventMapInteraction = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    // Only stop propagation but allow default behavior (for slider dragging)
    const stopPropagationOnly = useCallback((event) => {
        event.stopPropagation();
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (city && city.trim()) {
            navigate('/weather/' + city);
        }
    }, [navigate, city]);

    // Memoize the layer toggle button class
    const getLayerButtonClass = useCallback((isActive) => {
        const baseClasses = "flex items-center justify-center gap-2 w-full p-2 rounded-lg font-medium text-sm transition-all duration-200";
        
        if (props.mode === 'dark') {
            return isActive 
                ? `${baseClasses} bg-blue-600 text-white shadow-md border border-blue-700` 
                : `${baseClasses} bg-neutral-700 text-gray-200 hover:bg-neutral-600 border border-neutral-600`;
        } else {
            return isActive 
                ? `${baseClasses} bg-blue-500 text-white shadow-md` 
                : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
        }
    }, [props.mode]);

    // Memoize the input class
    const inputClassName = useMemo(() => 
        (props.mode === 'dark') 
            ? "w-full bg-neutral-800 border-b border-neutral-500 focus:border-blue-500 text-white p-2 pl-9 outline-none rounded-t-lg transition-all duration-200" 
            : "w-full bg-white border-b border-gray-300 focus:border-blue-500 text-black p-2 pl-9 outline-none rounded-t-lg transition-all duration-200",
    [props.mode]);

    // Memoize the input container class
    const inputContainerClass = useMemo(() => 
        (props.mode === 'dark')
            ? "relative mb-4"
            : "relative mb-4",
    [props.mode]);

    // Memoize the range input class
    const rangeClassName = useMemo(() => 
        (props.mode === 'dark') 
            ? "w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-neutral-700 to-blue-600 accent-blue-500" 
            : "w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-gray-300 to-blue-500 accent-blue-500",
    [props.mode]);

    // Memoize the range container class
    const rangeContainerClass = useMemo(() => 
        (props.mode === 'dark')
            ? "mb-5 p-4 bg-neutral-800 rounded-lg border border-neutral-700"
            : "mb-5 p-4 bg-gray-100 rounded-lg",
    [props.mode]);

    // Memoize the section title class
    const sectionTitleClass = useMemo(() => 
        (props.mode === 'dark')
            ? "text-sm font-medium text-gray-300 mb-2"
            : "text-sm font-medium text-gray-700 mb-2",
    [props.mode]);

    // Memoize the layer buttons container class
    const layerButtonsContainerClass = useMemo(() => 
        (props.mode === 'dark')
            ? "grid grid-cols-2 gap-2"
            : "grid grid-cols-2 gap-2",
    [props.mode]);

    return(
        <div 
            className={props.className} 
            id="menuOptions"
            onMouseMove={preventMapInteraction}
            onTouchMove={preventMapInteraction}
        >
            {/* Menu header with close button */}
            <div className="flex items-center justify-between mb-4">
                <h2 className={props.mode === 'dark' ? "text-lg font-semibold text-white" : "text-lg font-semibold text-gray-800"}>
                    Map Options
                </h2>
                <button 
                    onClick={props.onClose} 
                    className={props.mode === 'dark' 
                        ? "p-1 rounded-full bg-neutral-700 text-white hover:bg-neutral-600 transition-colors" 
                        : "p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    }
                    aria-label="Close menu"
                >
                    <IoClose size='20'/>
                </button>
            </div>

            {/* City search form */}
            <form onSubmit={handleSubmit}>
                <div className={inputContainerClass}>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <IoSearch size="18" />
                    </div>
                    <input
                        className={inputClassName}
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value.toUpperCase())}
                        placeholder="Search city..."
                        aria-label="Search for city"
                    />
                </div>
            </form>

            {/* Layer opacity control */}
            <div className={rangeContainerClass}>   
                <div className="flex items-center justify-between mb-2">
                    <label 
                        htmlFor="opacityBar" 
                        className={sectionTitleClass}
                    >
                        <div className="flex items-center gap-1">
                            <BsSliders />
                            <span>Layer Opacity</span>
                        </div>
                    </label>
                    <span className={props.mode === 'dark' ? "text-white font-medium text-sm" : "text-gray-700 font-medium text-sm"}>
                        {Math.round(props.layerOpacity * 100)}%
                    </span>
                </div>
                <input 
                    className={rangeClassName}
                    type="range"
                    id="opacityBar"
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
                <label className={sectionTitleClass}>
                    <div className="flex items-center gap-1 mb-2">
                        <IoLayers />
                        <span>Map Layers</span>
                    </div>
                </label>
                <div className={layerButtonsContainerClass}>
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
            </div>
        </div> 
    )
});

OptionsMethod.displayName = 'OptionsMethod';

export const MenuBar = (props) => {
    const [toggle, setToggle] = useState(false);

    // Memoize the menu button classes
    const menuButtonClass = useMemo(() => {
        const baseClasses = "absolute flex items-center py-2 px-3 rounded-r-lg top-24 z-40 transition-all duration-300";
        
        return props.mode === 'dark'
            ? `${baseClasses} bg-neutral-800 text-white border-y-2 border-r-2 border-neutral-600 shadow-lg hover:bg-neutral-700`
            : `${baseClasses} bg-white text-gray-800 border-y-2 border-r-2 border-gray-300 shadow-lg hover:bg-gray-100`;
    }, [props.mode]);

    // Memoize the options container class
    const optionsContainerClass = useMemo(() => {
        const baseClasses = "absolute mt-24 z-40 w-72 p-4 rounded-lg shadow-lg transition-all duration-300";
        
        return props.mode === 'dark'
            ? `${baseClasses} bg-neutral-800 border border-neutral-600 text-white ml-3`
            : `${baseClasses} bg-white border border-gray-300 text-gray-800 ml-3`;
    }, [props.mode]);

    const handleToggle = useCallback(() => {
        setToggle(prev => !prev);
    }, []);

    return(
        <div>
            {!toggle && (
                <button 
                    onClick={handleToggle} 
                    className={menuButtonClass}
                    aria-label="Open map options"
                >
                    <IoIosArrowBack size='20' className="mr-1" />
                    <span className="font-medium">Menu</span>
                </button>
            )}

            {toggle && (
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
                    layerOpacity={props.layerOpacity}
                    onLayerOpacityChange={props.onLayerOpacityChange}
                    onClose={handleToggle}
                    className={optionsContainerClass}
                />                              
            )}
        </div>
    );
};