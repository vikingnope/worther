import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export const MapMode = (props) => {
    const history = useNavigate();

    const handleSubmitDark = (e) => {
        e.preventDefault();

        history('/map/dark');
    }

    const handleSubmitLight = (e) => {
        e.preventDefault();

        history('/map/light');
    }

    return (
        <div className="z-50 absolute bottom-12 right-8">
            {
                (props.mode === 'light') ?
                    <button onClick={handleSubmitDark} className="bg-neutral-800 text-white p-2 rounded-lg" title="Dark Mode">
                        <MdDarkMode size={27}/> 
                    </button>
                    : 
                    <button onClick={handleSubmitLight} className="bg-neutral-300 text-white p-2 rounded-lg" title="Light Mode">
                        <MdOutlineLightMode size={27} color="black"/>
                    </button>
            }
        </div>
    )
}