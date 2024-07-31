import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import './Map.css';
import { ENV } from "../../env/env";
import { Geolocation, Position } from '@capacitor/geolocation';
import { IonIcon, IonSpinner } from "@ionic/react";
import { locationOutline } from "ionicons/icons";
import axios from "axios";
import { AndroidSettings, IOSSettings, NativeSettings } from "capacitor-native-settings";
import { MapAddressResponse } from "../../helper/types";

const MAP_SERVICE_SCRIPT = "https://js.api.here.com/v3/3.1/mapsjs-core.js";
const MAP_SERVICE_SCRIPT2 = "https://js.api.here.com/v3/3.1/mapsjs-service.js";
const MAP_SERVICE_SCRIPT3 = "https://js.api.here.com/v3/3.1/mapsjs-ui.js";
const MAP_SERVICE_SCRIPT4 = "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js";

const getCurrentPosition:() => Promise<Position> = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  return coordinates;
};

const checkPermission:() => Promise<boolean> = async () => {
  const checkPermission = await Geolocation.checkPermissions();
  return checkPermission.location==='granted' ? true : false;
};

const requestPermission:() => Promise<boolean> = async () => {
  const requestPermission = await Geolocation.requestPermissions();
  return requestPermission.location==='granted' ? true : false;
};

let HereMap:any = undefined;

type Props = {
    isEdit: boolean;
    currentLocation:  {
        lat: number;
        lng: number;
    } | undefined ;
    markerLocation:  {
        lat: number;
        lng: number;
    } | undefined ;
    setCurrentLocation: React.Dispatch<React.SetStateAction<{
        lat: number;
        lng: number;
    } | undefined>>;
    setMarkerLocation: React.Dispatch<React.SetStateAction<{
        lat: number;
        lng: number;
    } | undefined>>;
    mapAddress: MapAddressResponse | undefined;
    setMapAddress: React.Dispatch<React.SetStateAction<MapAddressResponse | undefined>>
}

const Map:FC<Props> = ({currentLocation, setCurrentLocation, markerLocation, setMarkerLocation, mapAddress, setMapAddress, isEdit}) => {
    const [permissionDeniedType, setPermissionDeniedType] = useState<'disabled' | 'denied'>('disabled');
    const [locationPermission, setLocationPermission] = useState<boolean>(true);
    const [locationPermissionLoading, setLocationPermissionLoading] = useState<boolean>(true);
    const ref = useRef<any>(null);

    const isClient = useMemo(() => typeof window !== "undefined", []);

    const [isMapLoading, setIsMapLoading] = useState(true);

    const checkScriptLoaded:boolean = useMemo(() => {
        if (!isClient || !("H" in window) || HereMap===undefined) return false;
        return true;
    }, [isClient, HereMap]);

    const loadScript = useCallback((scriptUrl: string) => {
        if (!isClient) return; // Don't execute this function if it's rendering on server side
        return new Promise((resolve, reject) => {
            const scriptTag = document.createElement("script");
            scriptTag.src = scriptUrl;
            scriptTag.onload = (ev) => {
                resolve(ev);
            };
            scriptTag.onerror = (err) => reject(err);
            document.body.appendChild(scriptTag);
        });
    }, []);

    const locationPermissionHandler = async () => {
        const isPermission = await checkPermission();
        if(isPermission){
            setCurrentLocationHandler();
        }else{
            requestPermissionHandler();
        }
    }

    const requestPermissionHandler = async () => {
        const requestPermissionStatus = await requestPermission();
        if(requestPermissionStatus){
            setCurrentLocationHandler();
        }else{
            setLocationPermission(false);
        }
    }

    const setCurrentLocationHandler = async () => {
        try {
            const currentPosition = await getCurrentPosition();
            setCurrentLocation({lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude});
            if(!isEdit){
                setMarkerLocation({lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude});
            }
            setLocationPermission(true);
        } catch (error:any) {
            if(error?.message === 'Location services are not enabled'){
                setPermissionDeniedType('disabled')
                setLocationPermission(false);
            }
        }
    }

    const openSettingHandler = async() => await openSettings(permissionDeniedType==='denied') 

    const openSettings = (app:boolean = false) => {
        return NativeSettings.open({
            optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
            optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
        })
    }

    const loadAllScripts = async() => {
        if (!checkScriptLoaded) {
            try {
                setIsMapLoading(true);
                await loadScript(MAP_SERVICE_SCRIPT);
                await loadScript(MAP_SERVICE_SCRIPT2);
                await loadScript(MAP_SERVICE_SCRIPT3);
                await loadScript(MAP_SERVICE_SCRIPT4);
                HereMap = (window as any).H;
            } catch (error: any) {
                throw new Error(error);
            }finally {
                setIsMapLoading(false);
            }
        }
    }

    useEffect(() => {
        loadAllScripts()
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setLocationPermissionLoading(true)
                await locationPermissionHandler();
            } catch (error) {}
            finally {
                setLocationPermissionLoading(false)
            }

        })()
      return () => {}
    }, [])
    
    useEffect(() => {
        (async () => {
            try {
                if(markerLocation){
                    await reverseGeoCode();
                }
            } catch (error) {

            }
            finally {
            }

        })()
      return () => {}
    }, [markerLocation])

  useEffect(() => {
      if (locationPermission && currentLocation!==undefined && markerLocation!==undefined && checkScriptLoaded) {
        // HereMap = (window as any).H;
        var platform = new HereMap.service.Platform({
            'apikey': ENV.HERE_MAP_APP_KEY
        });
        // Obtain the default map types from the platform object:
        var defaultLayers = platform.createDefaultLayers();
                
        //   // Instantiate (and display) a map object:
        var map = new HereMap.Map(
            ref.current,
            defaultLayers.vector.normal.map,
            {
                zoom: 16,
                center: { lat: markerLocation.lat, lng: markerLocation.lng },
                pixelRatio: window.devicePixelRatio || 1
            }
        );
        // add a resize listener to make sure that the map occupies the whole container
        window.addEventListener('resize', () => map.getViewPort().resize());
        //Step 3: make the map interactive
        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        var behavior = new HereMap.mapevents.Behavior(new HereMap.mapevents.MapEvents(map));

        // Create the default UI components
        var ui = HereMap.ui.UI.createDefault(map, defaultLayers);

        /**
         * Adds markers to the map highlighting the locations of the captials of
         * France, Italy, Germany, Spain and the United Kingdom.
         *
         * @param  {H.Map} map      A HERE Map instance within the application
         */
        if(markerLocation){
            var parisMarker = new HereMap.map.Marker({lat: markerLocation.lat, lng: markerLocation.lng}, {
                // mark the object as volatile for the smooth dragging
                volatility: true
            });
            map.addObject(parisMarker);
            map.addEventListener('drag', function(ev:any) {
                ev.preventDefault();
                var target = ev.target;
                if (target instanceof HereMap.Map) {
                    parisMarker.setGeometry({lat:target.getViewModel().a.position.lat, lng:target.getViewModel().a.position.lng});
                }
            }, false);
            map.addEventListener('dragend', function(ev:any) {
                ev.preventDefault();
                var target = ev.target;
                if (target instanceof HereMap.Map) {
                    parisMarker.setGeometry({lat:target.getViewModel().a.position.lat, lng:target.getViewModel().a.position.lng});
                    setMarkerLocation({lat:target.getViewModel().a.position.lat, lng:target.getViewModel().a.position.lng})
                }
            }, false);
        }
        setIsMapLoading(false);

    }
  }, [locationPermission, currentLocation, checkScriptLoaded]);

  const reverseGeoCode = async () => {
    if(markerLocation){
        try {
            const resp = await axios.get(`https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=${ENV.HERE_MAP_APP_KEY}&at=${markerLocation.lat},${markerLocation.lng}&lang=en-US`);
            if(resp.data.items && resp.data.items.length>0){
                setMapAddress(resp.data.items[0])
            }
        } catch (error) {
            console.log(error);
        }
    }
  }
    
    return <>
        {locationPermissionLoading ? <div className="text-center w-100 mt-1">
                <IonSpinner name="crescent" color='dark'></IonSpinner>
            </div> : (
                locationPermission ? <>
                    {
                        isMapLoading && <div className="text-center w-100 mt-1">
                            <IonSpinner name="crescent" color='dark'></IonSpinner>
                        </div>
                    }
                    <div style={ { width: "100%", height: "300px", overflow: 'auto' } } id="mapContainer" ref={ref} /> 
                </>
                : 
                <>
                    <div className="page-padding mt-1">
                        <div className="delivery-address-card">
                            <h6><IonIcon icon={locationOutline} className='svg-icon' /> {permissionDeniedType==='denied' ? <span>Location Permission</span> : <span>Location Service</span>}</h6>
                            <div className="delivery-card-row">
                                {permissionDeniedType==='denied' ? <p className="m-0">Please grant location permission to access current location.</p> : <p className="m-0">Please enable location services to access current location</p>}
                                <div className="delivery-select">
                                    <button onClick={async () => await openSettingHandler()}>Enable</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    </>;
}

export default Map;