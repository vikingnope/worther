

export const MenuBar = (props) => {
    return(
        <div className="leaflet-top ml-3 mt-24">
            <div className="absolute w-30 h-15 zIndex z-40 bg-white border-2 border-neutral-800 rounded-lg">
                <p className="font-bold text-sm ml-0.5">
                    Weather opacity:
                </p>
                <input 
                    className="accent-green-600 w-44"
                    type = "range"
                    value={100 * props.weatherOpacity}
                    min={0}
                    max={100}
                    onChange={event => props.onWeatherOpacityChange && props.onWeatherOpacityChange(Number(event.target.value) / 100)}
                />
            </div>
        </div>
    )
};