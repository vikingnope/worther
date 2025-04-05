import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

export const MapMode = ({ mode }) => {
    const navigate = useNavigate();
    const isDesktop = useDeviceDetect();

    const handleModeToggle = (e) => {
        e.preventDefault();
        navigate(mode === 'light' ? '/map/dark' : '/map/light');
    }

    return (
        <div className={`z-50 absolute ${isDesktop ? 'bottom-12 right-8' : 'bottom-16 right-4'}`}>
            <button 
                onClick={handleModeToggle} 
                className={`
                    flex items-center justify-center
                    ${isDesktop ? 'h-12 w-12' : 'h-10 w-10'} 
                    rounded-full shadow-lg 
                    transition-all duration-300
                    ${mode === 'light' 
                        ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    }
                    overflow-hidden
                    before:content-[''] 
                    before:absolute 
                    before:inset-0 
                    before:rounded-full 
                    before:opacity-0
                    before:transition-opacity
                    before:duration-300
                    cursor-pointer
                    ${mode === 'light'
                        ? 'before:bg-gradient-to-tr before:from-blue-700 before:to-purple-700 hover:before:opacity-20'
                        : 'before:bg-gradient-to-tr before:from-yellow-400 before:to-orange-500 hover:before:opacity-20'
                    }
                `}
                title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
                aria-label={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
            >
                {mode === 'light' 
                    ? <MdDarkMode className="relative z-10" size={isDesktop ? 24 : 20} /> 
                    : <MdOutlineLightMode className="relative z-10" size={isDesktop ? 24 : 20} />
                }

                {/* Subtle glow effect */}
                <span className={`
                    absolute inset-0 rounded-full opacity-0 transition-opacity duration-300
                    ${mode === 'light' 
                        ? 'bg-blue-500 hover:opacity-10' 
                        : 'bg-yellow-400 hover:opacity-10'
                    } filter blur-md
                `}></span>
            </button>
        </div>
    )
}