import L from 'leaflet';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ScaleControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import {
  WindSpeedLayer,
  TemperatureLayer,
  CloudLayer,
  RainViewerData,
  HybridLayer,
} from '@components/layers';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import useSettingsStore from '@stores/settingsStore';
import { Footer } from '@utils/footer';
import { Header } from '@utils/header';
import { CustomZoomControl, CustomAttributionControl, MenuBar } from '@utils/mapElements';
import { WeatherPopupContent } from '@utils/weatherVariables';

// Custom component to style popups based on map mode
const CustomPopupStyle = ({ theme }) => {
  const map = useMap();
  const isDesktop = useDeviceDetect();

  useEffect(() => {
    if (!map) return;

    // Get the map container to scope our selectors
    const mapContainer = map.getContainer();

    // Function to style a popup when it opens
    const stylePopup = e => {
      const popup = e.popup || e;
      const popupElement = popup.getElement ? popup.getElement() : e;

      if (!popupElement || !mapContainer.contains(popupElement)) return;

      // Find elements within this specific popup
      const contentWrapper = popupElement.querySelector('.leaflet-popup-content-wrapper');
      const popupTip = popupElement.querySelector('.leaflet-popup-tip');
      const popupContent = popupElement.querySelector('.leaflet-popup-content');
      const closeButton = popupElement.querySelector('.leaflet-popup-close-button');

      // Style the popup elements
      if (contentWrapper && popupTip) {
        const bgColor = theme === 'light' ? '#ffffff' : '#1a1a1a';
        const textColor = theme === 'light' ? '#000000' : '#ffffff';

        [contentWrapper, popupTip].forEach(element => {
          element.style.backgroundColor = bgColor;
          element.style.color = textColor;
        });
      }

      // Style the content wrapper with responsive sizing
      if (contentWrapper) {
        if (isDesktop) {
          contentWrapper.style.minWidth = '280px';
          contentWrapper.style.maxWidth = '320px';
        } else {
          contentWrapper.style.minWidth = '220px';
          contentWrapper.style.maxWidth = '260px';
        }
        contentWrapper.style.width = 'auto';
      }

      // Style the popup content
      if (popupContent) {
        popupContent.style.width = '100%';
        popupContent.style.margin = isDesktop ? '8px 12px' : '6px 8px';
        if (!isDesktop) {
          popupContent.style.fontSize = '0.9rem';
        }
      }

      // Style the close button
      if (closeButton) {
        closeButton.style.transition = 'all 0.2s ease';
        closeButton.style.cursor = 'pointer';
        closeButton.style.width = isDesktop ? '20px' : '18px';
        closeButton.style.height = isDesktop ? '20px' : '18px';
        closeButton.style.display = 'flex';
        closeButton.style.justifyContent = 'center';
        closeButton.style.alignItems = 'center';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.right = isDesktop ? '7px' : '5px';
        closeButton.style.top = isDesktop ? '12px' : '8px';
        closeButton.style.fontSize = isDesktop ? '16px' : '14px';
        closeButton.style.color = theme === 'light' ? '#000000' : '#ffffff';

        // Add hover event listeners
        closeButton.onmouseover = () => {
          closeButton.style.transform = 'scale(1.2)';
          closeButton.style.color = theme === 'light' ? '#333333' : '#aaaaaa';
          closeButton.style.fontWeight = 'bolder';
        };

        closeButton.onmouseout = () => {
          closeButton.style.transform = 'scale(1)';
          closeButton.style.color = theme === 'light' ? '#000000' : '#ffffff';
          closeButton.style.fontWeight = 'bold';
        };
      }
    };

    // Function to restyle all existing popups
    const updateAllPopups = () => {
      // Get all open popups
      mapContainer.querySelectorAll('.leaflet-popup').forEach(popupElement => {
        const popup = popupElement._leaflet_popup;
        if (popup) {
          stylePopup({ popup });
        } else {
          stylePopup(popupElement);
        }
      });
    };

    // Initial styling for any existing popups
    updateAllPopups();

    // Add event listener for new popups
    map.on('popupopen', stylePopup);

    // Re-style all popups whenever theme changes
    updateAllPopups();

    return () => {
      map.off('popupopen', stylePopup);
    };
  }, [theme, map, isDesktop]);

  return null; // This component doesn't render anything, just applies styling
};

// Custom component to dynamically update map background color
const MapBackgroundUpdater = ({ theme }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      // Get the map container element and update its background color
      const container = map.getContainer();
      if (container) {
        container.style.backgroundColor = theme === 'light' ? '#ffffff' : '#121212';
      }
    }
  }, [theme, map]);

  return null; // This component doesn't render anything, just applies styling
};

export default function ShowMap(props) {
  const [userPos, setUserPos] = useState({ latitude: undefined, longitude: undefined });
  const [layerOpacity, setLayerOpacity] = useState(props.layerOpacity || 0.7);
  const [cloudLayerChoice, setCloudLayerChoice] = useState(false);
  const [temperatureLayerChoice, setTemperatureLayerChoice] = useState(false);
  const [windLayerChoice, setWindLayerChoice] = useState(false);
  const [rainLayerChoice, setRainLayerChoice] = useState(true);
  const [satelliteLayerChoice, setSatelliteLayerChoice] = useState(false);
  const [windDirChoice, setWindDirChoice] = useState(false);
  const isDesktop = useDeviceDetect();

  const { theme } = useSettingsStore();

  document.title = 'Worther - Map';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const newUserPos = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setUserPos(newUserPos);
      });
    }
  }, []);

  const markerIconConst = useMemo(
    () =>
      L.divIcon({
        className: '',
        html: `
        <div class="relative">
          <div class="absolute w-8 h-8 bg-blue-300 bg-opacity-15 rounded-full animate-pulse"></div>
          <div class="absolute w-6 h-6 bg-blue-300 bg-opacity-25 rounded-full top-1 left-1"></div>
          <div class="absolute w-3 h-3 bg-blue-500 rounded-full top-2.5 left-2.5 shadow-md"></div>
        </div>
      `,
        iconAnchor: [16, 16], // Center of the marker
        popupAnchor: [0, -16], // Above the marker
        iconSize: [32, 32],
      }),
    []
  );

  const map = useCallback(
    (markerShow, zoomLevel) => {
      return (
        <div className="text-white flex flex-col min-h-screen overflow-hidden bg-black">
          <Header />
          <MapContainer
            center={
              userPos.latitude && userPos.longitude
                ? [userPos.latitude, userPos.longitude]
                : [45, 10]
            }
            zoom={zoomLevel}
            minZoom={2}
            maxBounds={[
              [-180, -180],
              [180, 180],
            ]}
            maxBoundsViscosity={0.75}
            doubleClickZoom={false}
            className="grow"
            style={!isDesktop ? { height: 'calc(85vh - 70px)' } : {}}
          >
            <ScaleControl position="bottomleft" />
            <CustomZoomControl theme={theme} />
            <CustomAttributionControl theme={theme} />
            <CustomPopupStyle theme={theme} />
            <TileLayer
              zIndex={1}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url={
                theme === 'light'
                  ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
              }
              subdomains="abcd"
            />
            <RainViewerData show={rainLayerChoice} opacity={layerOpacity} />
            <WindSpeedLayer show={windLayerChoice} opacity={layerOpacity} />
            <TemperatureLayer show={temperatureLayerChoice} opacity={layerOpacity} />
            <CloudLayer show={cloudLayerChoice} opacity={layerOpacity} />
            <HybridLayer show={satelliteLayerChoice} theme={theme} />
            <MapBackgroundUpdater theme={theme} />
            {/* <WindDirectionLayer show={windDirChoice} opacity={layerOpacity} /> */}
            <MenuBar
              mode={theme}
              showWindDir={windDirChoice}
              onShowWindDirChange={setWindDirChoice}
              showSatellite={satelliteLayerChoice}
              onShowSatelliteChange={setSatelliteLayerChoice}
              showRain={rainLayerChoice}
              onShowRainChange={setRainLayerChoice}
              showCloud={cloudLayerChoice}
              onShowCloudChange={setCloudLayerChoice}
              showWind={windLayerChoice}
              onShowWindChange={setWindLayerChoice}
              showTemperature={temperatureLayerChoice}
              onShowTemperatureChange={setTemperatureLayerChoice}
              layerOpacity={layerOpacity}
              onLayerOpacityChange={setLayerOpacity}
              showDayNight={dayNightLayerChoice}
              onShowDayNightChange={setDayNightLayerChoice}
            />
            {!markerShow ? (
              <Marker icon={markerIconConst} position={[userPos.latitude, userPos.longitude]}>
                <Popup>
                  <WeatherPopupContent
                    userPos={userPos}
                    color={theme === 'light' ? 'black' : 'white'}
                    theme={theme}
                    page={'map'}
                  />
                </Popup>
              </Marker>
            ) : (
              <></>
            )}
          </MapContainer>
          <Footer />
        </div>
      );
    },
    [
      userPos,
      theme,
      rainLayerChoice,
      windLayerChoice,
      temperatureLayerChoice,
      cloudLayerChoice,
      satelliteLayerChoice,
      windDirChoice,
      dayNightLayerChoice,
      layerOpacity,
      markerIconConst,
      isDesktop,
    ]
  );

  return <div>{userPos.latitude && userPos.longitude ? map(false, 6) : map(true, 3)}</div>;
}
