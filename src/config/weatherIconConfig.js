import { AiFillCloud } from 'react-icons/ai';
import {
  BsFillSunFill,
  BsFillCloudRainHeavyFill,
  BsFillCloudDrizzleFill,
  BsFillCloudLightningRainFill,
  BsFillCloudSnowFill,
  BsCloudFog,
  BsFillCloudRainFill,
  BsFillCloudsFill,
  BsFillCloudSunFill,
  BsFillCloudHazeFill,
} from 'react-icons/bs';
import { MdModeNight } from 'react-icons/md';
import { TbMist, TbWind } from 'react-icons/tb';
import {
  WiCloudyWindy,
  WiDayCloudyWindy,
  WiDayRainWind,
  WiDaySnowWind,
  WiNightFog,
  WiNightCloudyWindy,
  WiNightAltPartlyCloudy,
  WiNightAltCloudy,
  WiNightAltRainMix,
  WiNightAltRain,
  WiNightAltShowers,
  WiNightAltStormShowers,
  WiNightAltSnow,
  WiNightAltRainWind,
  WiSmoke,
  WiDust,
} from 'react-icons/wi';

/**
 * Weather icon configuration - declarative approach
 * Each condition defines codes and icons for all 4 states (night/day × windy/calm)
 * Reference: https://openweathermap.org/weather-conditions
 */
export const WEATHER_CONDITIONS = [
  // Thunderstorm (2xx)
  {
    codes: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
    icons: {
      night: { windy: WiNightAltStormShowers, calm: WiNightAltStormShowers },
      day: { windy: BsFillCloudLightningRainFill, calm: BsFillCloudLightningRainFill },
    },
  },
  // Light Drizzle (300-302)
  {
    codes: [300, 301, 302],
    icons: {
      night: { windy: WiNightAltRainWind, calm: WiNightAltShowers },
      day: { windy: BsFillCloudDrizzleFill, calm: BsFillCloudDrizzleFill },
    },
  },
  // Heavy Drizzle (310-321)
  {
    codes: [310, 311, 312, 313, 314, 321],
    icons: {
      night: { windy: WiNightAltRainWind, calm: WiNightAltRainMix },
      day: { windy: BsFillCloudDrizzleFill, calm: BsFillCloudDrizzleFill },
    },
  },
  // Light Rain (500)
  {
    codes: [500],
    icons: {
      night: { windy: WiNightAltRainWind, calm: WiNightAltRainMix },
      day: { windy: WiDayRainWind, calm: BsFillCloudRainFill },
    },
  },
  // Heavy Rain (501-531)
  {
    codes: [501, 502, 503, 504, 520, 521, 522, 531],
    icons: {
      night: { windy: WiNightAltRainWind, calm: WiNightAltRain },
      day: { windy: BsFillCloudRainHeavyFill, calm: BsFillCloudRainHeavyFill },
    },
  },
  // Freezing Rain (511)
  {
    codes: [511],
    icons: {
      night: { windy: WiNightAltSnow, calm: WiNightAltSnow },
      day: { windy: WiDaySnowWind, calm: BsFillCloudSnowFill },
    },
  },
  // Snow (6xx)
  {
    codes: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
    icons: {
      night: { windy: WiNightAltSnow, calm: WiNightAltSnow },
      day: { windy: WiDaySnowWind, calm: BsFillCloudSnowFill },
    },
  },
  // Mist (701)
  {
    codes: [701],
    icons: {
      night: { windy: WiNightFog, calm: WiNightFog },
      day: { windy: TbMist, calm: TbMist },
    },
  },
  // Smoke (711, 762)
  {
    codes: [711, 762],
    icons: {
      night: { windy: WiSmoke, calm: WiSmoke },
      day: { windy: WiSmoke, calm: WiSmoke },
    },
  },
  // Haze (721)
  {
    codes: [721],
    icons: {
      night: { windy: WiNightFog, calm: WiNightFog },
      day: { windy: BsFillCloudHazeFill, calm: BsFillCloudHazeFill },
    },
  },
  // Dust/Sand (731, 751, 761)
  {
    codes: [731, 751, 761],
    icons: {
      night: { windy: WiDust, calm: WiDust },
      day: { windy: WiDust, calm: WiDust },
    },
  },
  // Fog (741)
  {
    codes: [741],
    icons: {
      night: { windy: WiNightFog, calm: WiNightFog },
      day: { windy: BsCloudFog, calm: BsCloudFog },
    },
  },
  // Squall (771)
  {
    codes: [771],
    icons: {
      night: { windy: WiNightCloudyWindy, calm: WiNightAltCloudy },
      day: { windy: WiCloudyWindy, calm: BsFillCloudsFill },
    },
    sizeAdjust: { night: { windy: 20, calm: 20 }, day: { windy: 20, calm: 0 } },
  },
  // Tornado (781)
  {
    codes: [781],
    icons: {
      night: { windy: WiNightCloudyWindy, calm: WiNightAltCloudy },
      day: { windy: WiCloudyWindy, calm: BsFillCloudsFill },
    },
    sizeAdjust: { night: { windy: 20, calm: 20 }, day: { windy: 20, calm: 0 } },
  },
  // Clear (800)
  {
    codes: [800],
    icons: {
      night: { windy: MdModeNight, calm: MdModeNight },
      day: { windy: TbWind, calm: BsFillSunFill },
    },
  },
  // Few Clouds (801)
  {
    codes: [801],
    icons: {
      night: { windy: WiNightCloudyWindy, calm: WiNightAltCloudy },
      day: { windy: WiCloudyWindy, calm: AiFillCloud },
    },
    sizeAdjust: { night: { windy: 17, calm: 20 }, day: { windy: 20, calm: 0 } },
  },
  // Scattered Clouds (802-803)
  {
    codes: [802, 803],
    icons: {
      night: { windy: WiNightCloudyWindy, calm: WiNightAltPartlyCloudy },
      day: { windy: WiDayCloudyWindy, calm: BsFillCloudSunFill },
    },
    sizeAdjust: { night: { windy: 20, calm: 30 }, day: { windy: 0, calm: 0 } },
  },
  // Overcast Clouds (804)
  {
    codes: [804],
    icons: {
      night: { windy: WiNightCloudyWindy, calm: WiNightAltCloudy },
      day: { windy: WiCloudyWindy, calm: BsFillCloudsFill },
    },
    sizeAdjust: { night: { windy: 17, calm: 20 }, day: { windy: 20, calm: 0 } },
  },
];

/**
 * Builds the weather icons map from the declarative configuration
 * @returns {Object} Nested map: { night: { windy: {}, calm: {} }, day: { windy: {}, calm: {} } }
 */
export const buildWeatherIconsMap = () => {
  const map = {
    night: { windy: {}, calm: {} },
    day: { windy: {}, calm: {} },
  };

  WEATHER_CONDITIONS.forEach(condition => {
    const { codes, icons, sizeAdjust = {} } = condition;

    codes.forEach(code => {
      ['night', 'day'].forEach(timeOfDay => {
        ['windy', 'calm'].forEach(windCondition => {
          map[timeOfDay][windCondition][code] = {
            icon: icons[timeOfDay][windCondition],
            sizeAdjust: sizeAdjust[timeOfDay]?.[windCondition] || 0,
          };
        });
      });
    });
  });

  return map;
};

/**
 * Pre-built weather icons mapping configuration using OpenWeatherMap weather condition codes
 * Maps weather condition codes to appropriate icons based on time of day and wind conditions
 */
export const weatherIconsMap = buildWeatherIconsMap();
