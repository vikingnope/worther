import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current device is desktop-sized
 * @param {number} breakpoint - Width breakpoint in pixels to consider as desktop (default: 1024 for Tailwind's lg)
 * @returns {boolean} - Whether the current viewport is at least the desktop breakpoint width
 */
export const useDeviceDetect = (breakpoint = 1024) => {
  const [isDesktopView, setIsDesktopView] = useState(false);
  
  useEffect(() => {
    // Initial check on mount
    const checkScreenSize = () => {
      setIsDesktopView(window.innerWidth >= breakpoint);
    };
    
    // Set initial value
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);
  
  return isDesktopView;
};
