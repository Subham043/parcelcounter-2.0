
import { useEffect, useState } from "react";
import { Map as MapLibreMap, NavigationControl, Marker } from "maplibre-gl";
import { Geolocation, Position } from '@capacitor/geolocation';
import { IonIcon, IonSearchbar, IonSpinner, SearchbarInputEventDetail } from "@ionic/react";
import { locationOutline } from "ionicons/icons";
import { AndroidSettings, IOSSettings, NativeSettings } from "capacitor-native-settings";
import './Map.css';
import "maplibre-gl/dist/maplibre-gl.css";
import { ENV } from "../../env/env";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { useToast } from "../../hooks/useToast";
import { api_routes } from "../../helper/routes";
import debounce from "lodash.debounce";
import { OlaAddres } from "../../helper/types";

const marker = new Marker({
  anchor: 'center',
  color: '#222',
});

const getCurrentPosition: () => Promise<Position> = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  return coordinates;
};

const checkPermission: () => Promise<boolean> = async () => {
  const checkPermission = await Geolocation.checkPermissions();
  return checkPermission.location === 'granted' ? true : false;
};

const requestPermission: () => Promise<boolean> = async () => {
  const requestPermission = await Geolocation.requestPermissions();
  return requestPermission.location === 'granted' ? true : false;
};

const openSettings = (app: boolean = false) => {
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    })
}

type Props = {
    isEdit: boolean;
    currentLocation:  {
        lat: number;
        lng: number;
    } | undefined ;
    setCurrentLocation: React.Dispatch<React.SetStateAction<{
        lat: number;
        lng: number;
    } | undefined>>;
    mapAddress: OlaAddres|undefined;
    setMapAddress: React.Dispatch<React.SetStateAction<OlaAddres|undefined>>
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>
}

const OlaMap = ({isEdit, currentLocation, setCurrentLocation, mapAddress, setMapAddress, setConfirm}: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const { toastError } = useToast();
  const [mapReady, setMapReady] = useState(false);
  const [permissionDeniedType, setPermissionDeniedType] = useState<'disabled' | 'denied'>('disabled');
  const [locationPermission, setLocationPermission] = useState<boolean>(true);
  const [locationPermissionLoading, setLocationPermissionLoading] = useState<boolean>(true);
  const [reverseLoading, setReverseLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<OlaAddres[]>([]);
  const [mapEl, setMapEl] = useState<MapLibreMap|undefined>(undefined);

  const checkLocationPermission = async () => {
    try {
      if (await checkPermission()) {
        setCurrentLocationHandler();
        return;
      }
      if (await requestPermission()) {
        setCurrentLocationHandler();
        return;
      }
      setLocationPermission(false);
    } catch (error) {
      setLocationPermission(false);
    }
  }

  const reverseGeocodingHandler = debounce(async (params: {lat: number, lng: number}) => {
    setReverseLoading(true);
    try {
      const response = await axiosPrivate.post(api_routes.map_reverse, {
        lat: params.lat,
        lng: params.lng
      })
      if(response.data.data.length>0){
        setMapAddress({
          description: response.data.data[0].formatted_address,
          geometry: {
            location: {
              lat: response.data.data[0].geometry.location.lat,
              lng: response.data.data[0].geometry.location.lng
            }
          }
        })
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      }
    } finally{
      setReverseLoading(false)
    }
  }, 500);

  const setCurrentLocationHandler = async () => {
    try {
      const currentPosition = await getCurrentPosition();
      if(isEdit && mapAddress){
        setCurrentLocation({ lat: mapAddress.geometry.location.lat, lng: mapAddress.geometry.location.lng });
      }else{
        setCurrentLocation({ lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude });
        reverseGeocodingHandler({ lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude });
      }
      setLocationPermission(true);
    } catch (error: any) {
      if (error?.message === 'Location services are not enabled') {
        setPermissionDeniedType('disabled')
        setLocationPermission(false);
      }
    }
  }

  const openSettingHandler = async () => await openSettings(permissionDeniedType === 'denied')

  useEffect(() => {
    (async () => {
      try {
        setLocationPermissionLoading(true)
        await checkLocationPermission();
      } catch (error) {
        console.log(error);
      }
      finally {
        setLocationPermissionLoading(false)
      }

    })()
    return () => {
      setLocationPermissionLoading(false)
    }
  }, [])

  const setMarkerHandler = (params:{lat: number, lng: number}) => {
    if (!mapReady) return;
    if(mapEl){
      marker.setLngLat([params.lng, params.lat]).addTo(mapEl);
      mapEl.flyTo({
        center: [params.lng, params.lat],
        zoom: 16
      })
    }
  };

  useEffect(() => {
    if (!locationPermission) return;
    if (!mapReady) return;

    const map = new MapLibreMap({
      container: "map-container",
      center: currentLocation ? [currentLocation.lng, currentLocation.lat] : [77.6107065, 10.8812476],
      zoom: 16,
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      transformRequest: (url, resourceType) => {
        // Replace the wrong URL with the correct one
        url = url.replace("app.olamaps.io", "api.olamaps.io");

        // Add the API key to the URL based on existing parameters
        if (url.includes("?")) {
          url = url + "&api_key=" + ENV.OLA_MAP_API_KEY;
        } else {
          url = url + "?api_key=" + ENV.OLA_MAP_API_KEY;
        }
        return { url, resourceType };
      },
    });

    if (currentLocation) {
      marker.setLngLat([currentLocation.lng, currentLocation.lat]).addTo(map);
      map.flyTo({
        center: [currentLocation.lng, currentLocation.lat],
        zoom: 16
      })
    }

    map.on('touchstart', (e) => {
      if(e.lngLats.length>0){
        marker.setLngLat([e.lngLats[0].lng, e.lngLats[0].lat]).addTo(map);
        map.flyTo({
          center: [e.lngLats[0].lng, e.lngLats[0].lat],
          zoom: 16
        })
        reverseGeocodingHandler({ lat: e.lngLats[0].lat, lng: e.lngLats[0].lng })
      }
    });

    map.on("load", () => {
      const nav = new NavigationControl({
        visualizePitch: false,
        showCompass: true,
      });
      map.addControl(nav, "top-left");
    });

    setMapEl(map);

  }, [mapReady, locationPermission, currentLocation]);

  const onSearchHandler = async (key: string) => {
    if (key.length < 3) {
      setSearchResult([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await axiosPrivate.post<{ data: OlaAddres[] }>(api_routes.map_autocomplete, { key });
      setSearchResult(res.data.data);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      }
    } finally {
      setSearchLoading(false);
    }
  };
  return (
    <>
      {locationPermissionLoading ? <div className="text-center w-100 mt-1">
        <IonSpinner name="crescent" color='dark'></IonSpinner>
      </div> : (
        locationPermission ? <>
          <div style={{ width: "100%", height: "250px" }}>
            <div
              style={{ width: "100%", height: "100%", overflow: "hidden" }}
              id="map-container"
              ref={() => setMapReady(true)}
            />
          </div>
          <IonSearchbar showClearButton="focus" debounce={500} placeholder="Type to search Address..." className='search-input' onIonInput={(ev: CustomEvent<SearchbarInputEventDetail>) => onSearchHandler(ev.detail.value ?? '')} />
          <div className="page-padding ">
            <div style={{ width: "100%", minHeight: "300px", maxHeight: "300px", overflow: "auto" }}>
              {
                searchLoading ? <div className="text-center w-100 mt-1">
                  <IonSpinner name="crescent" color='dark'></IonSpinner>
                </div> :
                  (searchResult.length > 0 && searchResult.map((item: any, index: number) => <div className="address-suggestion-container" key={index}>
                    <p onClick={() => {
                      setMapAddress(item)
                      setMarkerHandler({
                        lat: item.geometry.location.lat,
                        lng: item.geometry.location.lng
                      })
                      setSearchResult([])
                    }}><span>{item.description}</span></p>
                  </div>))
              }
            </div>
            <div className="delivery-address-card map-selection-card">
              <div className='delivery-address-header' style={{gap: '10px', alignItems: 'end'}}>
                {
                  reverseLoading ? <div className="text-center w-100">
                    <IonSpinner name="crescent" color='light'></IonSpinner>
                  </div> : (
                    <>
                      <h6><span className="three-line-text">{mapAddress ? mapAddress.description : 'Please select a location'}</span></h6>
                      {
                        mapAddress && 
                        <div className="delivery-select">
                          <button onClick={() => setConfirm(false)}>Confirm</button>
                        </div>
                      }
                    </>  
                  )
                }
              </div>
            </div>
          </div>
        </>
          :
          <>
            <div className="page-padding mt-1">
              <div className="delivery-address-card">
                <div className='delivery-address-header'>
                  <h6><IonIcon icon={locationOutline} className='svg-icon' /> {permissionDeniedType === 'denied' ? <span>Location Permission</span> : <span>Location Service</span>}</h6>
                  <div className="delivery-select">
                    <button onClick={async () => await openSettingHandler()}>Enable</button>
                  </div>
                </div>
                <div className="delivery-detail">
                  {permissionDeniedType === 'denied' ? <p style={{ padding: '5px', paddingTop: '0px' }}>Please grant location permission to access current location.</p> : <p style={{ padding: '5px', paddingTop: '0px' }}>Please enable location services to access current location</p>}
                </div>
              </div>
            </div>
          </>
      )
      }
    </>
  );
};

export default OlaMap;