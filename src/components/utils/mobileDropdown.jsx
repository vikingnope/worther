import { useState, useEffect, useRef, memo } from 'react';
import { MdArrowLeft, MdOutlineSegment } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { NAV_ITEMS, NAV_ICONS } from '../../constants/headerConstants.jsx';

const Navigations = memo(({ text, path, currentLocation, onNavigate }) => {
  const active = currentLocation === path ? 'text-cyan-300' : 'text-gray-200';

  return (
    <Link
      to={path}
      className={`my-auto flex h-14 items-center justify-center gap-2 bg-black/40 px-3 text-2xl uppercase backdrop-blur-sm ${active} border-b border-cyan-900/30 transition-colors duration-200 hover:text-cyan-300`}
      aria-label={`Navigate to ${text}`}
      onClick={onNavigate}
    >
      {NAV_ICONS[text] ?? null}
      {text}
    </Link>
  );
});

Navigations.displayName = 'Navigations';

export const Dropdown = memo(props => {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle animation states when opened state changes
  useEffect(() => {
    if (opened) {
      setVisible(true);
      // Small delay to ensure DOM update before animation starts
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(true);
        });
      });
    } else {
      setAnimating(false);
    }
  }, [opened]);

  // Handle visibility after animation completes
  useEffect(() => {
    if (!animating && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300); // Match duration with the CSS transition
      return () => clearTimeout(timer);
    }
  }, [animating, visible]);

  const openMenu = () => {
    setOpened(true);
  };

  const closeMenu = () => {
    setAnimating(false);
    // Actual closing is handled by the effect above
    setTimeout(() => {
      setOpened(false);
    }, 50);
  };

  const toggleMenu = () => {
    if (!opened) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  return (
    <nav ref={dropdownRef}>
      <div className="mr-1">
        <button
          onClick={toggleMenu}
          className="mt-0.5 flex cursor-pointer text-gray-200 transition-colors duration-200 hover:text-cyan-300"
          aria-label={opened ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <MdOutlineSegment size="42" />
          <div
            className={`mt-1 -ml-2 transition-transform duration-300 ease-in-out ${opened ? '-rotate-90' : 'rotate-0'}`}
          >
            <MdArrowLeft size="35" />
          </div>
        </button>
      </div>

      {(opened || visible) && (
        <nav className={'absolute right-1 z-50 mt-1.5'}>
          <div
            className={`flex origin-top flex-col divide-y divide-cyan-900/30 overflow-hidden rounded-lg bg-black/40 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out ${animating ? 'translate-y-0 scale-100 transform opacity-100' : '-translate-y-2 scale-95 transform opacity-0'}`}
          >
            {NAV_ITEMS.map((item, index) => (
              <Navigations
                key={index}
                text={item.text}
                path={item.path}
                currentLocation={props.location}
                onNavigate={closeMenu}
              />
            ))}
          </div>
        </nav>
      )}
    </nav>
  );
});

Dropdown.displayName = 'Dropdown Navigation';
