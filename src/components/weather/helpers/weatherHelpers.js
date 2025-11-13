import { useMemo } from 'react';

import { VISIBILITY_RANGES, WIND_DIRECTIONS, WIND_FORCE_RANGES } from '@constants/weatherConstants';

/**
 * Formats a timezone offset in seconds to a GMT string
 * @param {number} timeZone - Timezone offset in seconds
 * @returns {string} Formatted timezone string (e.g., "GMT+5", "GMT-3:30")
 */
export function TimeZoneShow(props) {
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
}

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
export function VisibilityDesc(props) {
  const { visibility } = props;

  const visibilityDesc = VISIBILITY_RANGES.find(
    range => visibility >= range.min && visibility <= range.max
  );

  return visibilityDesc ? visibilityDesc.desc : '';
}

/**
 * Converts wind direction in degrees to cardinal direction
 * @param {Object} props - { windDegrees: number }
 * @returns {string} Cardinal direction (e.g., "N", "NE", "SSW")
 */
export function WindDirection(props) {
  const { windDegrees } = props;

  const direction = WIND_DIRECTIONS.find(dir => windDegrees >= dir.min && windDegrees <= dir.max);

  return direction ? direction.dir : '';
}

/**
 * Converts wind speed (m/s) to Beaufort scale force
 * @param {Object} props - { windSpeed: number }
 * @returns {string} Wind force description (e.g., "Force 5")
 */
export function WindForce(props) {
  const { windSpeed } = props;

  const force = WIND_FORCE_RANGES.find(range => windSpeed >= range.min && windSpeed < range.max);

  return force ? force.force : '';
}

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
