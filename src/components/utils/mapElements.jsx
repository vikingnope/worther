import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

/**
 * CustomZoomControl - A reusable component to style the Leaflet zoom controls
 * 
 * @param {Object} props - Component props
 * @param {string} [props.mapType='light'] - The map theme ('light' or 'dark')
 * @returns {null} - This component doesn't render anything visible, just applies styling
 */
export const CustomZoomControl = ({ mapType = 'light' }) => {
  const map = useMap();
  
  useEffect(() => {
    // Find all zoom control elements and style them according to map type
    const zoomInButton = document.querySelector('.leaflet-control-zoom-in');
    const zoomOutButton = document.querySelector('.leaflet-control-zoom-out');
    const zoomContainer = document.querySelector('.leaflet-control-zoom');
    
    if (zoomInButton && zoomOutButton && zoomContainer) {
      // Apply styles to the container
      zoomContainer.style.border = 'none';
      zoomContainer.style.boxShadow = mapType === 'light' 
        ? '0 2px 10px rgba(0, 0, 0, 0.1)' 
        : '0 2px 10px rgba(0, 0, 0, 0.4)';
      zoomContainer.style.borderRadius = '8px';
      zoomContainer.style.overflow = 'hidden';
      
      // Common styles for both buttons
      [zoomInButton, zoomOutButton].forEach(button => {
        button.style.transition = 'all 0.2s ease';
        button.style.border = 'none';
        button.style.width = '36px';
        button.style.height = '36px';
        button.style.lineHeight = '36px';
        button.style.fontSize = '18px';
        button.style.fontWeight = 'bold';
        
        // Hover effect
        button.onmouseover = () => {
          if (mapType === 'light') {
            button.style.backgroundColor = '#f0f0f0';
          } else {
            button.style.backgroundColor = '#444';
          }
        };
        
        // Reset on mouseout
        button.onmouseout = () => {
          if (mapType === 'light') {
            button.style.backgroundColor = '#fff';
          } else {
            button.style.backgroundColor = '#333';
          }
        };
      });
      
      // Apply theme-specific styles
      if (mapType === 'light') {
        // Light mode styling
        zoomInButton.style.color = '#333';
        zoomInButton.style.backgroundColor = '#fff';
        zoomOutButton.style.color = '#333';
        zoomOutButton.style.backgroundColor = '#fff';
      } else {
        // Dark mode styling
        zoomInButton.style.color = '#f0f0f0';
        zoomInButton.style.backgroundColor = '#333';
        zoomOutButton.style.color = '#f0f0f0';
        zoomOutButton.style.backgroundColor = '#333';
      }
    }
  }, [mapType, map]);
  
  return null; // This component doesn't render anything, just applies styling
};

/**
 * CustomAttributionControl - A reusable component to style the Leaflet attribution control
 * 
 * @param {Object} props - Component props
 * @param {string} [props.mapType='light'] - The map theme ('light' or 'dark')
 * @returns {null} - This component doesn't render anything visible, just applies styling
 */
export const CustomAttributionControl = ({ mapType = 'light' }) => {
  const map = useMap();
  
  useEffect(() => {
    // Find attribution control element and style according to map type
    const attributionElement = document.querySelector('.leaflet-control-attribution');
    
    if (attributionElement) {
      // Apply common styles
      attributionElement.style.transition = 'all 0.2s ease';
      attributionElement.style.padding = '5px 8px';
      attributionElement.style.fontSize = '11px';
      attributionElement.style.lineHeight = '1.2';
      attributionElement.style.boxShadow = mapType === 'light' 
        ? '0 1px 5px rgba(0, 0, 0, 0.1)' 
        : '0 1px 5px rgba(0, 0, 0, 0.4)';
      attributionElement.style.whiteSpace = 'nowrap';
      attributionElement.style.overflow = 'hidden';
      attributionElement.style.textOverflow = 'ellipsis';
      attributionElement.style.maxWidth = 'calc(100vw - 20px)';
      attributionElement.style.borderRadius = '8px 0 0 0';
      
      // Add hover behavior to show full text
      attributionElement.onmouseover = () => {
        attributionElement.style.whiteSpace = 'normal';
        attributionElement.style.maxWidth = '300px';
        attributionElement.style.zIndex = '1000';
      };
      
      attributionElement.onmouseout = () => {
        attributionElement.style.whiteSpace = 'nowrap';
        attributionElement.style.overflow = 'hidden';
        attributionElement.style.textOverflow = 'ellipsis';
        attributionElement.style.maxWidth = 'calc(100vw - 20px)';
      };
      
      // Improve links styling
      const links = attributionElement.querySelectorAll('a');
      links.forEach(link => {
        link.style.textDecoration = 'none';
        link.style.fontWeight = '500';
        link.style.transition = 'color 0.2s ease';
        
        if (mapType === 'light') {
          link.style.color = '#0078A8';
        } else {
          link.style.color = '#6BB0FF';
        }
        
        // Add hover effect
        link.onmouseover = () => {
          if (mapType === 'light') {
            link.style.color = '#005580';
          } else {
            link.style.color = '#99CCFF';
          }
        };
        
        link.onmouseout = () => {
          if (mapType === 'light') {
            link.style.color = '#0078A8';
          } else {
            link.style.color = '#6BB0FF';
          }
        };
      });
      
      // Apply theme-specific styles
      if (mapType === 'light') {
        // Light mode
        attributionElement.style.color = '#333';
        attributionElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      } else {
        // Dark mode
        attributionElement.style.color = '#e0e0e0';
        attributionElement.style.backgroundColor = 'rgba(40, 40, 40, 0.9)';
      }
    }
  }, [mapType, map]);
  
  return null; // This component doesn't render anything, just applies styling
};

/**
 * MapMode - A component that provides a toggle button to switch between light and dark map modes
 * 
 * @param {Object} props - Component props
 * @param {string} props.mode - The current map mode ('light' or 'dark')
 * @returns {JSX.Element} - The map mode toggle button
 */
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