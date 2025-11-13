import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    set => ({
      theme: 'dark',

      // Units
      temperatureUnit: 'celsius', // 'celsius' or 'fahrenheit'
      distanceUnit: 'km', // 'km' or 'mi'
      speedUnit: 'kmh', // 'kmh', 'mph', 'ms', 'knots'
      pressureUnit: 'hPa', // 'hPa', 'mmHg', 'inHg', 'psi'
      precipitationUnit: 'mm', // 'mm' or 'in'

      timeFormat: '24h',
      defaultLocation: '', // Store the user's preferred default location

      setTheme: theme => set({ theme }),

      // Unit setters
      setTemperatureUnit: temperatureUnit => set({ temperatureUnit }),
      setDistanceUnit: distanceUnit => set({ distanceUnit }),
      setSpeedUnit: speedUnit => set({ speedUnit }),
      setPressureUnit: pressureUnit => set({ pressureUnit }),
      setPrecipitationUnit: precipitationUnit => set({ precipitationUnit }),

      setTimeFormat: timeFormat => set({ timeFormat }),
      setDefaultLocation: defaultLocation => set({ defaultLocation }),
      resetSettings: () =>
        set({
          theme: 'dark',
          temperatureUnit: 'celsius',
          distanceUnit: 'km',
          speedUnit: 'kmh',
          pressureUnit: 'hPa',
          precipitationUnit: 'mm',
          timeFormat: '24h',
          defaultLocation: '',
        }),
    }),
    {
      name: 'settings-store',
    }
  )
);

export default useSettingsStore;
