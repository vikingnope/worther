import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    set => ({
      theme: 'dark',
      units: 'metric',

      setTheme: theme => set({ theme }),
      setUnits: units => set({ units }),
      resetSettings: () => set({ theme: 'dark', units: 'metric' }),
    }),
    {
      name: 'settings-store',
    }
  )
);

export default useSettingsStore;
