

export const MenuBar = (props) => {
    return(
        <div className="relative ml-3 mt-24 cursor-default" id="opacityBar">
            <div className="absolute w-30 h-15 zIndex z-50 bg-white border-2 border-neutral-800 rounded-lg">
                <p className="font-bold text-sm ml-0.5">
                    Weather opacity (only click):
                </p>
                <input 
                    className="accent-green-600 w-44 cursor-pointer"
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