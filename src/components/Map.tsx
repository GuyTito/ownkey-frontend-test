import {
  ControlPosition,
  InfoWindow,
  Map,
  MapControl,
  Marker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { ElementRef, useEffect, useRef, useState } from "react";
import { Poi } from "../App";
import { convertCoordinates, throttle } from "../utils/helpers";

type Polyline = google.maps.Polyline;

interface MapProps {
  searchArea?: (vertices: string[]) => void;
  locations: Poi[];
  reset: () => void;
}

const AppMap = ({ searchArea, locations, reset }: MapProps) => {
  const coreLibrary = useMapsLibrary("core");
  const mapsLibrary = useMapsLibrary("maps");
  const mapInstance = useMap();

  const mapContainerRef = useRef<ElementRef<"div"> | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const polylineRef = useRef<Polyline | null>(null);

  const mapContainer = mapContainerRef.current;

  const [drawing, setDrawing] = useState(false);
  const [vertices, setVertices] = useState<string[]>([]);
  const [activeMarker, setActiveMarker] = useState<Poi>();

  const triggerMouseMoveEventOnMap = () => {
    if (!coreLibrary || !mapInstance) return;
    coreLibrary.event.trigger(mapInstance, "mousemove");
  };

  const polylineOptions = {
    strokeColor: "black",
    fillColor: "black",
    strokeOpacity: 0.8,
    strokeWeight: 2,
  };
  const handleMouseDownListener = () => {
    polylineRef.current = new mapsLibrary!.Polyline(polylineOptions);
    polylineRef.current.setMap(mapInstance);
    isMouseDownRef.current = true;
  };

  const handleMapMouseMoveListener = (e: google.maps.MapMouseEvent) => {
    if (!isMouseDownRef.current || !e.latLng || !polylineRef.current) return;

    const path = polylineRef.current.getPath().getArray();
    path.push(e.latLng);
    polylineRef.current.setPath(path);
  };

  const handleMouseUpListener = () => {
    const path = polylineRef.current!.getPath().getArray();
    path.push(polylineRef.current!.getPath().getArray()[0]);
    polylineRef.current?.setPath(path);

    const coords = polylineRef.current
      ?.getPath()
      .getArray()
      .map((latLng) => ({ lat: latLng!.lat(), lng: latLng!.lng() }));

    if (coords?.length) {
      setVertices(convertCoordinates(coords));
    }

    stopDrawing();
  };

  const startDrawing = () => {
    setDrawing(true);
    if (mapInstance) {
      mapInstance.setOptions({
        draggableCursor: "crosshair",
        gestureHandling: "none",
      });
    }
    polylineRef.current?.setMap(null);
    polylineRef.current = null;
    setVertices([]);
    reset();
    setActiveMarker(undefined);
  };

  const stopDrawing = () => {
    setDrawing(false);
    if (mapInstance) {
      mapInstance.setOptions({
        draggableCursor: "",
        gestureHandling: "greedy",
      });
    }

    isMouseDownRef.current = false;

    // convert polyline to polygon
    polylineRef.current?.setMap(null);
    polylineRef.current = new google.maps.Polygon({
      paths: polylineRef.current?.getPath().getArray(),
      // editable: true,
      fillOpacity: 0.35,
      ...polylineOptions,
    });
    polylineRef.current.setMap(mapInstance);
  };

  function toggleDrawing() {
    if (drawing) {
      stopDrawing();
    } else {
      startDrawing();
    }
  }

  useEffect(() => {
    if (!mapInstance || !coreLibrary || !mapContainer) return;

    if (drawing) {
      mapContainer.addEventListener("mousedown", handleMouseDownListener);
      mapContainer.addEventListener("mouseup", handleMouseUpListener);

      mapContainer.addEventListener("touchstart", handleMouseDownListener);
      mapContainer.addEventListener(
        "touchmove",
        throttle(triggerMouseMoveEventOnMap, 150)
      );
      mapContainer.addEventListener("touchend", handleMouseUpListener);

      coreLibrary.event.addListener(
        mapInstance,
        "mousemove",
        throttle(handleMapMouseMoveListener, 150)
      );
    }

    return () => {
      coreLibrary.event.clearListeners(mapInstance, "mousemove");
      mapContainer.removeEventListener("mousedown", handleMouseDownListener);
      mapContainer.removeEventListener("mouseup", handleMouseUpListener);

      mapContainer.removeEventListener("touchmove", triggerMouseMoveEventOnMap);
      mapContainer.removeEventListener("touchstart", handleMouseDownListener);
      mapContainer.removeEventListener("touchend", handleMouseUpListener);
    };
  }, [mapInstance, coreLibrary, mapContainer, drawing]);

  return (
    <div ref={mapContainerRef} className="flex flex-col h-full w-full relative">
      <Map
        defaultZoom={12}
        defaultCenter={{ lat: 34.03891123674213, lng: -118.24232837686432 }}
      >
        {vertices.length > 0 && (
          <PoiMarkers pois={locations} setActiveMarker={setActiveMarker} />
        )}

        {/* {!drawing && ( */}
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <button
            // onClick={startDrawing}
            onClick={toggleDrawing}
            className="bg-gray-200 text-black hover:opacity-80 transmooth rounded-full py-1 px-2 text-sm mr-2"
          >
            {drawing ? "Stop" : "Draw"}
          </button>
        </MapControl>
        {/* )} */}

        {vertices.length > 0 && !locations && (
          <MapControl position={ControlPosition.TOP}>
            <button
              onClick={() => searchArea?.(vertices)}
              className="bg-pink-500 text-white hover:opacity-80 transmooth rounded-full py-1 px-2 text-sm mt-5"
            >
              Search this area
            </button>
          </MapControl>
        )}

        {activeMarker?.id && (
          <InfoWindow position={activeMarker?.location}>
            <div className=" text-xs md:text-sm text-slate-500">
              <p className="text-sm md:text-lg font-bold">
                {activeMarker?.poi.name}
              </p>
              <p>{activeMarker?.poi.phone}</p>
              <p>{activeMarker?.address.freeformAddress}</p>
              <p>{activeMarker?.poi.url}</p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};

export default AppMap;

const PoiMarkers = ({
  pois,
  setActiveMarker,
}: {
  pois: Poi[];
  setActiveMarker: (poi: Poi) => void;
}) => {
  return (
    <>
      {pois?.map((poi: Poi) => (
        <Marker
          key={poi.id}
          position={poi.location}
          onClick={() => setActiveMarker(poi)}
        />
      ))}
    </>
  );
};
