import { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS, NAV_ICONS } from '../../constants/headerConstants.jsx';
import { MdArrowLeft, MdOutlineSegment } from 'react-icons/md';

const Navigations = memo(({ text, path, currentLocation, onNavigate }) => {
  const active = currentLocation === path ? 'text-cyan-300' : 'text-gray-200';

  return (
    <Link
      to={path}
      className={`h-14 flex justify-center px-3 items-center gap-2 uppercase text-2xl bg-black/40 backdrop-blur-sm my-auto ${active} hover:text-cyan-300 transition-colors duration-200 border-b border-cyan-900/30`}
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
          className="flex mt-0.5 text-gray-200 hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
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
            className={`flex flex-col rounded-lg bg-black/40 backdrop-blur-md shadow-lg overflow-hidden divide-y divide-cyan-900/30
                            transition-all duration-300 ease-in-out origin-top
                            ${animating ? 'opacity-100 transform translate-y-0 scale-100' : 'opacity-0 transform -translate-y-2 scale-95'}`}
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
