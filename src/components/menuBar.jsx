import { useState, useCallback, useMemo, memo } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { CiMenuKebab } from "react-icons/ci";

// Move utility function outside React rendering lifecycle
const getButtonClassByMode = (mode, isActive, extraClasses = '') => {
    const baseClass = `mr-5 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 duration-200 w-fit px-2 ${extraClasses}`;
    
    if (mode === 'dark') {
        return isActive 
            ? `${baseClass} bg-[#424040]` 
            : `${baseClass} bg-black-700`;
    } else {
        return isActive 
            ? `${baseClass} bg-[#dedede]` 
            : `${baseClass} bg-white`;
    }
};

// Memoize the options component to prevent unnecessary re-renders
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

    // Memoize button class generation
    const getButtonClass = useCallback((isActive, extraClasses) => 
        getButtonClassByMode(props.mode, isActive, extraClasses), 
    [props.mode]);

    // Memoize the input class
    const inputClassName = useMemo(() => 
        (props.mode === 'dark') 
            ? "border-b border-neutral-500 bg-neutral-800 h-7 text-base font-bold indent-1.5 outline-hidden w-full" 
            : "border-b border-black bg-white h-7 text-base font-bold indent-1.5 outline-hidden w-full text-black",
    [props.mode]);

    // Memoize the range input class
    const rangeClassName = useMemo(() => 
        (props.mode === 'dark') 
            ? "z-50 w-48 m-2 h-2 rounded-lg appearance-none cursor-pointer bg-linear-to-r from-neutral-600 to-white accent-white" 
            : "z-50 w-48 m-2 h-2 rounded-lg appearance-none cursor-pointer bg-linear-to-r from-gray-100 to-gray-400 accent-black",
    [props.mode]);

    return(
        <> 
            <div 
                className={props.className} 
                id="opacityBar"
                onMouseMove={preventMapInteraction}
                onTouchMove={preventMapInteraction}
            >
                <button 
                    onClick={props.onClose} 
                    className='absolute right-0.5'
                >
                    <AiOutlineClose size='28'/>
                </button>
                <form 
                    onSubmit={handleSubmit}
                >
                    <input
                        className={inputClassName}
                        type="text"
                        value={city}
                        autoFocus={true}
                        onChange={(e) => setCity(e.target.value.toUpperCase())}
                        placeholder="Enter City"
                    />
                </form>
                <div className="flex items-center my-1">   
                    <label 
                        htmlFor="opacityBar" 
                        className="text-base mx-1"
                    >
                        Layers Opacity:
                    </label>             
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
                    />
                </div>
                <div>
                    <label 
                        htmlFor="weather" 
                        className="ml-1 block text-base"
                    >
                        Choose any layers:
                    </label>
                    <button 
                        onClick={() => props.onShowWindChange?.(!props.showWind)}
                        className={getButtonClass(props.showWind)}
                    >
                        Wind
                    </button>
                    <button 
                        onClick={() => props.onShowTemperatureChange?.(!props.showTemperature)}
                        className={getButtonClass(props.showTemperature)}
                    >
                        Temperature
                    </button>
                    <button 
                        onClick={() => props.onShowCloudChange?.(!props.showCloud)}
                        className={getButtonClass(props.showCloud)}
                    >
                        Cloud
                    </button>
                    <button 
                        onClick={() => props.onShowRainChange?.(!props.showRain)}
                        className={getButtonClass(props.showRain)}
                    >
                        Rain
                    </button>
                    <button 
                        onClick={() => props.onShowSatelliteChange?.(!props.showSatellite)} 
                        className={getButtonClass(props.showSatellite, "lg:inline block")}
                    >
                        Satellite
                    </button>
                </div> 
            </div> 
        </>
    )
});

OptionsMethod.displayName = 'OptionsMethod';

export const MenuBar = (props) => {
    const [toggle, setToggle] = useState(false);

    // Memoize the menu button class
    const menuButtonClass = useMemo(() => 
        (props.mode === 'dark') 
            ? 'absolute border-y-2 border-r-2 w-fit text-white text-lg font-bold bg-neutral-800 top-24 rounded-r-lg border-neutral-500 py-1 h-fit' 
            : 'absolute border-y-2 border-r-2 border-black w-fit text-black text-lg font-bold bg-white top-24 rounded-r-lg py-1 h-fit',
    [props.mode]);

    // Memoize the options container class
    const optionsContainerClass = useMemo(() => 
        (props.mode === 'dark') 
            ? "absolute ml-3 mt-24 w-max h-min z-40 bg-neutral-800 border-2 rounded-md cursor-default p-px text-white border-neutral-500" 
            : "absolute ml-3 z-40 mt-24 w-max h-min bg-white border-2 border-black rounded-md cursor-default p-px text-black",
    [props.mode]);

    const handleToggle = useCallback(() => {
        setToggle(prev => !prev);
    }, []);

    return(
        <div>
            {!toggle && (
                <button onClick={handleToggle} className={menuButtonClass}>
                    <CiMenuKebab size='30'/>
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