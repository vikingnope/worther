import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { CiSquarePlus, CiSquareMinus, CiMenuKebab } from "react-icons/ci";

export const MenuBar = (props) => {
    const [ toggle, setToggle ] = useState(false);
    const[ city, setCity ] = useState();
    const history = useNavigate();

    // Helper function to generate button classes
    const getButtonClass = (mode, isActive, extraClasses) => {
        const baseClass = `mr-5 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 duration-200 w-fit px-2 ${extraClasses || ''}`;
        
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

    // Prevents the map from moving when the menu is open
    const handleMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const increaseOpacity = () => {
        if (props.layerOpacity < 1) {
            props.onLayerOpacityChange && props.onLayerOpacityChange(props.layerOpacity + 0.1);
        }
    }

    const decreaseOpacity = () => {
        if (props.layerOpacity > 0) {
            props.onLayerOpacityChange && props.onLayerOpacityChange(props.layerOpacity - 0.1);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        history('/weather/' + city);
    }

    const OptionsMethod = (props) => {

        return(
            <> 
                <div onMouseMove={handleMouseDown} className={props.className} id="opacityBar">
                    <button onClick={() => setToggle(!toggle)} className='absolute right-0.5'>
                        <AiOutlineClose size='28'/>
                    </button>
                    <form onSubmit={handleSubmit}>
                        <input
                            className={(props.mode === 'dark') ? "border-b border-neutral-500 bg-neutral-800 h-7 text-base font-bold indent-1.5 outline-none w-full" : "border-b border-black bg-white h-7 text-base font-bold indent-1.5 outline-none w-full text-black"}
                            type="text"
                            value={city}
                            autoFocus="autoFocus"
                            onChange={(e) => setCity(e.target.value.toUpperCase())}
                            placeholder="Enter City"
                        />
                    </form>
                    <div>
                        <label htmlFor="weather" className="text-base ml-1 mr-px">
                            Layers opacity:
                        </label>
                    </div>
                    <div>
                        <button onClick={decreaseOpacity}>
                            <CiSquareMinus size={40}/>
                        </button>                    
                        <input 
                            className={(props.mode === 'dark') ? "z-50 accent-white w-48 m-2" : "accent-black w-48 m-2 z-50"}
                            type="range"
                            id="opacityBar"
                            value={100 * props.layerOpacity}
                            min={0}
                            max={100}
                            onChange={e => props.onLayerOpacityChange && props.onLayerOpacityChange(Number(e.target.value) / 100)}
                        />
                        <button onClick={increaseOpacity}>
                            <CiSquarePlus size={40}/>
                        </button>
                    </div>
                    <div>
                        <label htmlFor="weather" className="ml-1 block text-base">
                            Choose any layers:
                        </label>
                        <button 
                            onClick={e => props.onShowWindChange?.(!props.showWind)}
                            className={getButtonClass(props.mode, props.showWind)}
                        >
                            Wind
                        </button>
                        <button 
                            onClick={e => props.onShowTemperatureChange?.(!props.showTemperature)}
                            className={getButtonClass(props.mode, props.showTemperature)}
                        >
                            Temperature
                        </button>
                        <button 
                            onClick={e => props.onShowCloudChange?.(!props.showCloud)}
                            className={getButtonClass(props.mode, props.showCloud)}
                        >
                            Cloud
                        </button>
                        <button 
                            onClick={e => props.onShowRainChange?.(!props.showRain)}
                            className={getButtonClass(props.mode, props.showRain)}
                        >
                            Rain
                        </button>
                        <button 
                            onClick={e => props.onShowSatelliteChange?.(!props.showSatellite)} 
                            className={getButtonClass(props.mode, props.showSatellite, "lg:inline block")}
                        >
                            Satellite
                        </button>
                        {/* <button 
                            onClick={e => props.onShowWindDirChange?.(!props.showWindDir)} 
                            className={getButtonClass(props.mode, props.showWindDir)}
                        >
                            Wind Dir
                        </button> */}
                    </div> 
                </div> 
            </>
        )
    }

    return(
        <div>
            {
            (!toggle) ?
                <button onClick={() => setToggle(!toggle)} className={(props.mode === 'dark') ? 
                    'absolute border-y-2 border-r-2 w-fit text-white text-lg font-bold bg-neutral-800 top-24 rounded-r-lg border-neutral-500 py-1 h-fit' : 
                    'absolute border-y-2 border-r-2 border-black w-fit text-black text-lg font-bold bg-white top-24 rounded-r-lg py-1 h-fit'
                }>
                    <CiMenuKebab size='30'/>
                </button>
            :
            <></>
            }

            {
                (toggle) ?
                    <OptionsMethod mode={props.mode} showWindDir={props.showWindDir} onShowWindDirChange={props.onShowWindDirChange} showSatellite={props.showSatellite} onShowSatelliteChange={props.onShowSatelliteChange} showRain={props.showRain} onShowRainChange={props.onShowRainChange} showCloud={props.showCloud} onShowCloudChange={props.onShowCloudChange} showWind={props.showWind} onShowWindChange={props.onShowWindChange} showTemperature={props.showTemperature} onShowTemperatureChange={props.onShowTemperatureChange} layerOpacity={props.layerOpacity} onLayerOpacityChange={props.onLayerOpacityChange} className={(props.mode === 'dark') ? "absolute ml-3 mt-24 w-max h-min z-40 bg-neutral-800 border-2 rounded-md cursor-default p-px text-white border-neutral-500" : "absolute ml-3 z-40 mt-24 w-max h-min bg-white border-2 border-black rounded-md cursor-default p-px text-black"}/>                              
                :
                <></>
            }
        </div>
    )
};