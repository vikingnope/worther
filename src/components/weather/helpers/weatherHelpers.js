import { memo, useMemo } from 'react';

/**
 * Formats a timezone offset in seconds to a GMT string
 * @param {number} timeZone - Timezone offset in seconds
 * @returns {string} Formatted timezone string (e.g., "GMT+5", "GMT-3:30")
 */
export const TimeZoneShow = memo(props => {
  const formatTimezone = useMemo(() => {
    // Error handling for invalid inputs
    if (props.timeZone === undefined || props.timeZone === null) {
      return 'GMT';
    }

    const offsetSeconds = parseInt(props.timeZone);

    // Handle invalid parsing or extreme values
    if (isNaN(offsetSeconds) || Math.abs(offsetSeconds) > 86400) {
      console.warn(`Invalid timezone offset: ${props.timeZone}`);
      return 'GMT';
    }

    // Handle GMT case
    if (offsetSeconds === 0) {
      return 'GMT';
    }

    // Calculate hours and minutes
    const absOffsetSeconds = Math.abs(offsetSeconds);
    const hours = Math.floor(absOffsetSeconds / 3600);
    const minutes = Math.floor((absOffsetSeconds % 3600) / 60);

    // Determine sign
    const sign = offsetSeconds > 0 ? '+' : '-';

    // Format the timezone string
    if (minutes === 0) {
      return `GMT${sign}${hours}`;
    } else {
      return `GMT${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
    }
  }, [props.timeZone]);

  return formatTimezone || '';
});

TimeZoneShow.displayName = 'TimeZoneShow';

/**
 * Calculates local sunrise and sunset times based on UTC timestamps and timezone offset
 * @param {Object} props - { sunrise: number, sunset: number, timeZone: number }
 * @returns {Object} { sunriseHour, sunriseMinute, sunsetHour, sunsetMinute }
 */
export const SunriseSunsetTimes = props => {
  const sunriseTime = new Date(
    props.sunrise * 1000 + props.timeZone * 1000 + new Date().getTimezoneOffset() * 60 * 1000
  );
  const sunsetTime = new Date(
    props.sunset * 1000 + props.timeZone * 1000 + new Date().getTimezoneOffset() * 60 * 1000
  );

  return {
    sunriseHour: sunriseTime.getHours(),
    sunriseMinute: sunriseTime.getMinutes(),
    sunsetHour: sunsetTime.getHours(),
    sunsetMinute: sunsetTime.getMinutes(),
  };
};

SunriseSunsetTimes.displayName = 'SunriseSunsetTimes';

/**
 * Converts visibility in meters to a descriptive string
 * @param {Object} props - { visibility: number }
 * @returns {string} Visibility description
 */
export const VisibilityDesc = memo(props => {
  const visibilityRanges = [
    { min: 0, max: 50, desc: 'Dense Fog' },
    { min: 50, max: 200, desc: 'Thick Fog' },
    { min: 200, max: 500, desc: 'Moderate Fog' },
    { min: 500, max: 1000, desc: 'Light Fog' },
    { min: 1000, max: 2000, desc: 'Thin Fog' },
    { min: 2000, max: 4000, desc: 'Haze' },
    { min: 4000, max: 10000, desc: 'Light Haze' },
    { min: 10000, max: 10000, desc: 'Clear' },
  ];

  const { visibility } = props;

  const visibilityDesc = visibilityRanges.find(
    range => visibility >= range.min && visibility <= range.max
  );

  return visibilityDesc ? visibilityDesc.desc : '';
});

VisibilityDesc.displayName = 'VisibilityDesc';

/**
 * Converts wind direction in degrees to cardinal direction
 * @param {Object} props - { windDegrees: number }
 * @returns {string} Cardinal direction (e.g., "N", "NE", "SSW")
 */
export const WindDirection = memo(props => {
  const windDirections = [
    { min: 348.75, max: 360, dir: 'N' },
    { min: 0, max: 11.25, dir: 'N' },
    { min: 11.26, max: 33.75, dir: 'NNE' },
    { min: 33.75, max: 56.25, dir: 'NE' },
    { min: 56.25, max: 78.75, dir: 'ENE' },
    { min: 78.75, max: 101.25, dir: 'E' },
    { min: 101.25, max: 123.75, dir: 'ESE' },
    { min: 123.75, max: 146.25, dir: 'SE' },
    { min: 146.25, max: 168.75, dir: 'SSE' },
    { min: 168.75, max: 191.25, dir: 'S' },
    { min: 191.25, max: 213.75, dir: 'SSW' },
    { min: 213.75, max: 236.25, dir: 'SW' },
    { min: 236.25, max: 258.75, dir: 'WSW' },
    { min: 258.75, max: 281.25, dir: 'W' },
    { min: 281.25, max: 303.75, dir: 'WNW' },
    { min: 303.75, max: 326.25, dir: 'NW' },
    { min: 326.25, max: 348.75, dir: 'NNW' },
  ];

  const { windDegrees } = props;

  const direction = windDirections.find(dir => windDegrees >= dir.min && windDegrees <= dir.max);

  return direction ? direction.dir : '';
});

WindDirection.displayName = 'WindDirection';

/**
 * Converts wind speed (m/s) to Beaufort scale force
 * @param {Object} props - { windSpeed: number }
 * @returns {string} Wind force description (e.g., "Force 5")
 */
export const WindForce = memo(props => {
  const windForceRanges = [
    { min: 0, max: 0.3, force: 'Force 0' },
    { min: 0.3, max: 1.5, force: 'Force 1' },
    { min: 1.5, max: 3.3, force: 'Force 2' },
    { min: 3.3, max: 5.5, force: 'Force 3' },
    { min: 5.5, max: 8.0, force: 'Force 4' },
    { min: 8.0, max: 10.8, force: 'Force 5' },
    { min: 10.8, max: 13.9, force: 'Force 6' },
    { min: 13.9, max: 17.2, force: 'Force 7' },
    { min: 17.2, max: 20.7, force: 'Force 8' },
    { min: 20.7, max: 24.5, force: 'Force 9' },
    { min: 24.5, max: 28.4, force: 'Force 10' },
    { min: 28.4, max: 32.6, force: 'Force 11' },
    { min: 32.6, max: Infinity, force: 'Force 12' },
  ];

  const { windSpeed } = props;

  const force = windForceRanges.find(range => windSpeed >= range.min && windSpeed < range.max);

  return force ? force.force : '';
});

WindForce.displayName = 'WindForce';

/**
 * Formats time display with proper hour wrapping for 24-hour format
 * @param {number} hour - Hour value
 * @param {number} minute - Minute value
 * @returns {string} Formatted time string (HH:MM)
 */
export const formatTimeDisplay = (hour, minute) => {
  const adjustedHour = hour > 23 ? hour - 24 : hour < 0 ? hour + 24 : hour;
  return `${adjustedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};
