import {AiOutlineSearch} from 'react-icons/ai';
import {AiOutlineClose} from 'react-icons/ai';

export const MenuBar = (props) => {
    return(
        <section className="relative leaflet-top leaflet-left">
            <div className="absolute ml-3 mt-24 w-52 h-15 z-50 bg-white border-2 border-neutral-800 rounded-lg cursor-default p-px" id="opacityBar">
                <div className="absolute ml-44 mt-px">
                    <AiOutlineSearch size="23" />
                    {/* {search.length === 0 ? <AiOutlineSearch size="23"/> : <AiOutlineClose size="23"/>} */}
                </div>
                <form>
                    <input
                        className="ml-0.5 border-b-2 border-sky-900 w-44 h-7 text-base font-bold indent-0.5 border-dashed outline-none"
                        type="text"
                        placeholder="Location"
                    />
                </form>
                <label for="weather" className="font-bold text-sm ml-0.5">
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