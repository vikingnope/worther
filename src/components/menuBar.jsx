import { AiOutlineSearch } from 'react-icons/ai';

export const MenuBar = (props) => {

    return(
        <section className="leaflet-top leaflet-left">
            <div className="absolute ml-3 mt-24 w-52 h-15 bg-white border-2 border-neutral-800 rounded-lg cursor-default p-px" id="opacityBar">
                <label htmlFor="weather" className="font-bold text-sm ml-0.5">
                    Weather opacity (only click):
                </label>
                <input 
                    className="accent-green-600 w-48 cursor-pointer draggable"
                    type = "range"
                    id="weather"
                    value={100 * props.weatherOpacity}
                    min={0}
                    max={100}
                    onChange={event => props.onWeatherOpacityChange && props.onWeatherOpacityChange(Number(event.target.value) / 100)}
                />
            </div>
        </section>
    )
};
