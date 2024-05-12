import { isMobile, isDesktop } from 'react-device-detect';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";

export const MenuBar = (props) => {
    const [ toggle, setToggle ] = useState(false);
    const[ city, setCity ] = useState();
    const history = useNavigate();

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
                <div onMouseMove={handleMouseDown}>
                    <button onClick={() => setToggle(!toggle)} className={props.setClassName}>
                        <AiOutlineClose size='28'/>
                    </button>
                    <div className={(props.mode === 'dark') ? "absolute ml-3 mt-24 w-max h-min z-40 bg-black border-2 border-white rounded-md cursor-default p-px text-white" : "absolute ml-3 z-40 mt-24 w-max h-min bg-white border-2 border-black rounded-md cursor-default p-px text-black"} id="opacityBar">
                        <form onSubmit={handleSubmit}>
                            <input
                                className={(props.mode === 'dark') ? "border-b border-white bg-black h-7 text-base font-bold indent-1.5 outline-none w-full" : "border-b border-black bg-white h-7 text-base font-bold indent-1.5 outline-none w-full text-black"}
                                type="text"
                                value={city}
                                autoFocus="autoFocus"
                                onChange={(e) => setCity(e.target.value.toUpperCase())}
                                placeholder="Enter City"
                            />
                        </form>
                        <div>
                            <label htmlFor="weather" className="text-base ml-1 mr-px">
                                Layers opacity (Does not work with Night):
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
                            <button onClick={e => props.onShowWindChange && props.onShowWindChange(!props.showWind)} className={(props.mode === 'dark') ? ((!props.showWind) ? "mr-5 mt-1 mb-1 text-base ml-1 rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-14" : "mr-5 mb-1 mt-1 text-base ml-1 rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold w-14") : ((!props.showWind)? "mr-5 mt-1 mb-1 text-base ml-1 rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-14" : "mr-5 mb-1 mt-1 text-base ml-1 rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold w-14")}>
                                Wind
                            </button>
                            <button onClick={e => props.onShowTemperatureChange && props.onShowTemperatureChange(!props.showTemperature)} className={(props.mode === 'dark') ? ((!props.showTemperature)? "mr-5 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-28": "w-28 mr-5 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showTemperature)? "mr-5 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-28": "w-28 mr-5 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                                Temperature
                            </button>
                            <button onClick={e => props.onShowCloudChange && props.onShowCloudChange(!props.showCloud)} className={(props.mode === 'dark') ? ((!props.showCloud)? "mr-5 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-14" : "mr-5 text-base w-14 rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showCloud)? "mr-5 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-14" : "mr-5 text-base w-14 rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                                Cloud
                            </button>
                            <button onClick={e => props.onShowRainChange && props.onShowRainChange(!props.showRain)} className={(props.mode === 'dark') ? ((!props.showRain)? "mr-2 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-12" : "mr-2 w-12 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showRain)? "mr-2 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-12" : "mr-2 w-12 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                                Rain
                            </button>
                            {(isDesktop)?
                                <>
                                    <button onClick={e => props.onShowNightChange && props.onShowNightChange(!props.showNight)} className={(props.mode === 'dark') ? ((!props.showNight)? "block-inline mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-14" : "block-inline mr-2 w-14 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showNight)? "block-inline mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-14" : "block-inline mr-2 w-14 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                                        Night
                                    </button>
                                    <button onClick={e => props.onShowSatelliteChange && props.onShowSatelliteChange(!props.showSatellite)} className={(props.mode === 'dark') ? ((!props.showSatellite)? "mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-20" : "mr-2 w-20 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showSatellite)? "mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-20" : "mr-2 w-20 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                                        Satellite
                                    </button> 
                                    <button onClick={e => props.onShowWindDirChange && props.onShowWindDirChange(!props.showWindDir)} className={(props.mode === 'dark') ? ((!props.showWindDir)? "mr-2 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-20" : "mr-2 w-20 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showWindDir)? "mr-2 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-20" : "mr-2 w-20 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                                        Wind Dir
                                    </button>
                                </>
                                :
                                <>
                                    <button onClick={e => props.onShowNightChange && props.onShowNightChange(!props.showNight)} className={(props.mode === 'dark') ? ((!props.showNight)? "block mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-14" : "block mr-2 w-14 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showNight)? "block mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-14" : "block mr-2 w-14 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                                        Night
                                    </button>
                                    <button onClick={e => props.onShowSatelliteChange && props.onShowSatelliteChange(!props.showSatellite)} className={(props.mode === 'dark') ? ((!props.showSatellite)? "mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-20" : "mr-2 w-20 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showSatellite)? "mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-20" : "mr-2 w-20 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                                        Satellite
                                    </button>
                                    <button onClick={e => props.onShowWindDirChange && props.onShowWindDirChange(!props.showWindDir)} className={(props.mode === 'dark') ? ((!props.showWindDir)? "mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-20" : "mr-2 w-20 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showWindDir)? "mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-20" : "mr-2 w-20 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                                        Wind Dir
                                    </button>
                                </>
                            }
                            
                        </div> 
                    </div> 
                </div>
            </>
        )
    }

    if (isDesktop) { 
        return(
            <div>
                {
                (!toggle) ?
                    <button onClick={() => setToggle(!toggle)} className={(props.mode === 'dark') ? 'absolute border-y-2 border-r-2 w-7 h-28 text-white text-lg font-bold bg-black top-24 left-0 rounded-r-lg' : 'absolute border-y-2 border-r-2 border-black w-7 h-28 text-black text-lg font-bold bg-white top-24 left-0 rounded-r-lg'}>
                        <p>M</p>
                        <p>E</p>
                        <p>N</p>
                        <p>U</p>
                    </button>
                :
                <></>
                }

                {
                    (toggle) ?
                        <OptionsMethod mode={props.mode} showWindDir={props.showWindDir} onShowWindDirChange={props.onShowWindDirChange} showSatellite={props.showSatellite} onShowSatelliteChange={props.onShowSatelliteChange} showNight={props.showNight} onShowNightChange={props.onShowNightChange} showRain={props.showRain} onShowRainChange={props.onShowRainChange} showCloud={props.showCloud} onShowCloudChange={props.onShowCloudChange} showWind={props.showWind} onShowWindChange={props.onShowWindChange} showTemperature={props.showTemperature} onShowTemperatureChange={props.onShowTemperatureChange} layerOpacity={props.layerOpacity} onLayerOpacityChange={props.onLayerOpacityChange} setClassName={(props.mode === 'dark') ? 'absolute border-2 text-lg font-bold left-1/4 top-16 rounded-md px-1 bg-black' : 'absolute border-2 border-black text-lg font-bold left-1/4 top-16 rounded-md px-1 bg-white text-black'}/>                              
                    :
                    <></>
                }
            </div>
        )
    } 
    else if (isMobile) {
        return(
            <div>
                {
                (!toggle) ?
                    <button onClick={() => setToggle(!toggle)} className={(props.mode === 'dark') ? 'absolute border-y-2 border-r-2 w-7 h-28 text-white text-lg font-bold bg-black top-24 left-0 rounded-r-lg' : 'absolute border-y-2 border-r-2 border-black w-7 h-28 text-black text-lg font-bold bg-white top-24 left-0 rounded-r-lg'}>
                        <p>M</p>
                        <p>E</p>
                        <p>N</p>
                        <p>U</p>
                    </button>
                :
                <></>
                }

                {
                    (toggle) ?
                        <OptionsMethod mode={props.mode} showWindDir={props.showWindDir} onShowWindDirChange={props.onShowWindDirChange} showSatellite={props.showSatellite} onShowSatelliteChange={props.onShowSatelliteChange} showNight={props.showNight} onShowNightChange={props.onShowNightChange} showRain={props.showRain} onShowRainChange={props.onShowRainChange} showCloud={props.showCloud} onShowCloudChange={props.onShowCloudChange} showWind={props.showWind} onShowWindChange={props.onShowWindChange} showTemperature={props.showTemperature} onShowTemperatureChange={props.onShowTemperatureChange} layerOpacity={props.layerOpacity} onLayerOpacityChange={props.onLayerOpacityChange} setClassName={(props.mode === 'dark') ? 'absolute border-2 text-lg font-bold right-3.5 top-16 rounded-md px-1 bg-black' : 'absolute border-2 border-black text-lg font-bold right-3.5 top-16 rounded-md px-1 bg-white text-black'}/>   
                    :
                    <></>
                }
            </div>
        )
    }
};
