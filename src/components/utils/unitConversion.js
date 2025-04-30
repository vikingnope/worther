export const CelsiusToFahrenheit = celsius => {
  return (celsius * 9) / 5 + 32;
};
export const KmToMiles = kilometers => {
  return kilometers * 0.621371;
};
export const KmPerHourToMilesPerHour = kmPerHour => {
  return kmPerHour * 0.621371;
};
export const KmPerHourToMetersPerSecond = kmPerHour => {
  return kmPerHour / 3.6;
};
export const KmPerHourToKnots = kmPerHour => {
  return kmPerHour / 1.852;
};
export const HectoToMmHg = hPa => {
  return hPa * 0.750062;
};

export const HectoToInHg = hPa => {
  return hPa * 0.02953;
};

export const HectoToPsi = hPa => {
  return hPa * 0.0145038;
};

export const MmToInch = mm => {
  return mm * 0.0393701;
};

export const TwentyFourHourToTwelveHour = time => {
  const [hour, minute] = time.split(':');
  const hourInt = parseInt(hour, 10);
  const ampm = hourInt >= 12 ? 'PM' : 'AM';
  const hour12 = hourInt % 12 || 12; // Convert to 12-hour format
  return `${hour12}:${minute} ${ampm}`;
};
