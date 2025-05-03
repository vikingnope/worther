import useSettingsStore from '@stores/settingsStore';

const CelsiusToFahrenheit = celsius => {
  return (celsius * 9) / 5 + 32;
};

const KmToMiles = kilometers => {
  return kilometers * 0.621371;
};

const KmPerHourToMilesPerHour = kmPerHour => {
  return kmPerHour * 0.621371;
};

const KmPerHourToMetersPerSecond = kmPerHour => {
  return kmPerHour / 3.6;
};
const KmPerHourToKnots = kmPerHour => {
  return kmPerHour / 1.852;
};
const HectoToMmHg = hPa => {
  return hPa * 0.750062;
};

const HectoToInHg = hPa => {
  return hPa * 0.02953;
};

const HectoToPsi = hPa => {
  return hPa * 0.0145038;
};

const MmToInch = mm => {
  return mm * 0.0393701;
};

const TwentyFourHourToTwelveHour = time => {
  const [hour, minute] = time.split(':');
  const hourInt = parseInt(hour, 10);
  const ampm = hourInt >= 12 ? 'PM' : 'AM';
  const hour12 = hourInt % 12 || 12; // Convert to 12-hour format
  return `${hour12}:${minute} ${ampm}`;
};

// Renamed to follow React Hook naming convention (starts with "use")
const useConversionFunction = weather => {
  // Now it's valid to use hooks inside this function
  const { temperatureUnit, distanceUnit, speedUnit, pressureUnit, precipitationUnit, timeFormat } =
    useSettingsStore();

  console.log('Settings:', {
    temperatureUnit,
    distanceUnit,
    speedUnit,
    pressureUnit,
    precipitationUnit,
  });

  console.log('Weather:', weather);

  const conversionFunctions = {
    temperature:
      temperatureUnit === 'fahrenheit'
        ? CelsiusToFahrenheit(weather.temperature)
        : weather.temperature,
    distance: distanceUnit === 'mi' ? KmToMiles(weather.visibility) : weather.visibility,
    speed:
      speedUnit === 'mph'
        ? KmPerHourToMilesPerHour(weather.windSpeed)
        : speedUnit === 'ms'
          ? KmPerHourToMetersPerSecond(weather.windSpeed)
          : speedUnit === 'knots'
            ? KmPerHourToKnots(weather.windSpeed)
            : weather.windSpeed,
    pressure:
      pressureUnit === 'mmHg'
        ? HectoToMmHg(weather.pressure)
        : pressureUnit === 'inHg'
          ? HectoToInHg(weather.pressure)
          : pressureUnit === 'psi'
            ? HectoToPsi(weather.pressure)
            : weather.pressure,
    precipitation: precipitationUnit === 'in' ? MmToInch : null,
    time: timeFormat === '12h' ? TwentyFourHourToTwelveHour : null,
  };

  return conversionFunctions;
};

export default useConversionFunction;
