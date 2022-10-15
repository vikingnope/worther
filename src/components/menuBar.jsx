export const MenuBar = (props) => {

    return(
        <section className="leaflet-top leaflet-left">
            <div className={(props.mode === 'dark') ? "absolute ml-3 mt-24 w-max h-min bg-black border-2 border-white rounded cursor-default p-px text-white" : "absolute ml-3 mt-24 w-max h-min bg-white border-2 border-black rounded cursor-default p-px text-black"} id="opacityBar">
                <div>
                    <label htmlFor="weather" className="text-base ml-1 mr-px">
                        Layers opacity (only click | does not work with Night):
                    </label>
                    <input 
                        className={(props.mode === 'dark') ? "block accent-white w-48 ml-1 mt-px cursor-pointer draggable" : "block accent-black w-48 ml-1 mt-px cursor-pointer draggable"}
                        type = "range"
                        id="weather"
                        value={100 * props.layerOpacity}
                        min={0}
                        max={100}
                        onChange={e => props.onLayerOpacityChange && props.onLayerOpacityChange(Number(e.target.value) / 100)}
                    />
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
                    <button onClick={e => props.onShowNightChange && props.onShowNightChange(!props.showNight)} className={(props.mode === 'dark') ? ((!props.showNight)? "block mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-black duration-200 w-14" : "block mr-2 w-14 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold") : ((!props.showNight)? "block mr-2 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-white duration-200 w-14" : "block mr-2 w-14 mt-1 mb-1 ml-1 text-base rounded-md border-zinc-600 border-2 h-7 bg-cyan-500 duration-200 font-bold")}>
                        Night
                    </button>
                </div>
            </div>
        </section>
    )
};
