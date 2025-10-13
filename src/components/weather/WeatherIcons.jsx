import { memo, useMemo } from 'react';
import { LiaLocationArrowSolid } from 'react-icons/lia';

import { weatherIconsMap } from '@config/weatherIconConfig';

/**
 * WeatherIcons component - Displays appropriate weather icon based on conditions
 * @param {Object} props
 * @param {number} props.weatherId - OpenWeatherMap weather condition code
 * @param {number} props.windSpeed - Wind speed in m/s
 * @param {number} props.timeZone - Timezone offset in seconds
 * @param {number} props.sunriseHour - Local sunrise hour
 * @param {number} props.sunsetHour - Local sunset hour
 * @param {number} [props.hourConversion] - Optional hour override
 * @param {string} [props.page] - Display size: 'single' (200px), 'multiple' (50px), default (85px)
 * @param {string} [props.color='white'] - Icon color
 */
export const WeatherIcons = memo(props => {
  const currentHourConversion = useMemo(() => {
    const d = new Date();
    const baseHour = props.hourConversion || d.getHours();
    return Math.round((baseHour * 3600 + d.getTimezoneOffset() * 60 + props.timeZone) / 3600);
  }, [props.timeZone, props.hourConversion]);

  const size = useMemo(
    () => (props.page === 'single' ? 200 : props.page === 'multiple' ? 50 : 85),
    [props.page]
  );

  const isNight = useMemo(
    () =>
      currentHourConversion <= props.sunriseHour || currentHourConversion >= props.sunsetHour + 1,
    [currentHourConversion, props.sunriseHour, props.sunsetHour]
  );

  const icon = useMemo(() => {
    const timeOfDay = isNight ? 'night' : 'day';
    const windCondition = props.windSpeed >= 8.0 ? 'windy' : 'calm';

    // Use weatherId to lookup the icon
    const iconConfig = weatherIconsMap[timeOfDay]?.[windCondition]?.[props.weatherId];

    if (iconConfig) {
      const IconComponent = iconConfig.icon;
      return (
        <IconComponent size={size + (iconConfig.sizeAdjust || 0)} color={props.color || 'white'} />
      );
    }

    // Fallback for any uncovered conditions
    console.warn(
      `No weather icon found for: ${timeOfDay}, ${windCondition}, weatherId: ${props.weatherId}`
    );
    return <></>;
  }, [props.weatherId, props.windSpeed, isNight, size, props.color]);

  return icon;
});

WeatherIcons.displayName = 'WeatherIcons';

/**
 * WindArrow component - Displays an arrow pointing in the wind direction
 * @param {Object} props
 * @param {number} props.degrees - Wind direction in degrees
 */
export const WindArrow = memo(({ degrees }) => {
  return (
    <LiaLocationArrowSolid
      className="h-6 w-6 text-red-400"
      style={{
        transform: `rotate(${(degrees + 180) % 360}deg)`,
        transition: 'transform 0.5s ease-in-out',
      }}
    />
  );
});

WindArrow.displayName = 'WindArrow';
