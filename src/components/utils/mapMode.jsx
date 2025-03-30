import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export const MapMode = ({ mode }) => {
    const navigate = useNavigate();

    const handleModeToggle = (e) => {
        e.preventDefault();
        navigate(mode === 'light' ? '/map/dark' : '/map/light');
    }

    return (
        <div className="z-50 absolute bottom-12 right-8">
            <button 
                onClick={handleModeToggle} 
                className={`p-2 rounded-lg ${mode === 'light' ? 'bg-neutral-800 text-white' : 'bg-neutral-300'}`}
                title={`${mode === 'light' ? 'Dark' : 'Light'} Mode`}
            >
                {mode === 'light' 
                    ? <MdDarkMode size={27}/> 
                    : <MdOutlineLightMode size={27} color="black"/>
                }
            </button>
        </div>
    )
}