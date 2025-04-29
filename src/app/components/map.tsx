"use client";

import ReactMapGL, { type MapRef, type MapMouseEvent, Source, Layer, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Feature, FeatureCollection, Point } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import { usePinImage } from '../hooks/usePinImage';
import MapControls from './map-controls';
import mapboxgl from 'mapbox-gl';

// Configure Mapbox GL
mapboxgl.config.API_URL = 'http://localhost:3000/api/map-proxy';
mapboxgl.config.REQUIRE_ACCESS_TOKEN = false;
mapboxgl.config.SESSION_PATH = '';
//mapboxgl.config.EVENTS_URL = null; // read-only

const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface MapProps {
  data: FeatureCollection<Point> | null
  mapLoaded: boolean
  onLoad: () => void
}

export default function Map({ data, mapLoaded, onLoad }: MapProps){
  const mapRef = useRef<MapRef>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | number | undefined>();
  const [selectedPoint, setSelectedPoint] = useState<Feature<Point>>();
  const [renderPins, setRenderPins] = useState(false);
  
  // load pin image in custom hook
  const imageLoaded = usePinImage(mapRef, mapLoaded);

  // reset hovered/selected points when new map data load
  useEffect(() => {
    setHoveredPointId(undefined);
    setSelectedPoint(undefined);
  }, [data]);

  // called when the mouse is moving over the map
  function handleMouseMove(e: MapMouseEvent){
    if(!e.features) return;
    // update hovered point
    setHoveredPointId((e.features.length) ? e.features[0].id : undefined);
  }

  // called when the mouse clicks on the map
  function handleMouseDown(e: MapMouseEvent){
    if(!e.features?.length) return;
    // update selected point
    const clickedPoint = e.features[0] as Feature<Point>;
    setSelectedPoint((clickedPoint.id !== selectedPoint?.id) ? clickedPoint : undefined);
  }

  // redirect mapbox requests to proxy
  function redirectToProxy(url: string){
    // ONLY redirect Mapbox API requests
    console.log('url from react-map-gl:', url);

    const mapboxPath = url.split('api.mapbox.com/')[1];
    if(!mapboxPath) return { url };
    // TODO: address this (explicit origin required in string)
    const proxyUrl = `http://localhost:3000/api/map-proxy/${mapboxPath}`;
    console.log('proxyUrl:', proxyUrl);
    return { url: proxyUrl };
  }

  // render error message if the access token is not provided
  if(!mapToken){
    console.error('Error: Cannot display map; invalid access token.');
    return (
      <div className="bg-slate-500 w-full h-full text-center pt-40">
        <h2 className="font-bold text-4xl text-red-300">ERROR</h2>
        <p className="text-2xl text-red-100">Cannot display map; invalid access token</p>
      </div>
    );
  }

  return (
    <ReactMapGL
      mapLib={mapboxgl}
      ref={mapRef}
      style={{width: "100%", height: "100%"}}
      mapStyle="mapbox://styles/mapbox/light-v11"
      projection="mercator"
      initialViewState={{
        longitude: -74,
        latitude: 40.68,
        zoom: 10,
      }}
      interactiveLayerIds={["data-pin", "data-point"]}
      cursor={(hoveredPointId !== undefined) ? 'pointer' : undefined}
      onLoad={onLoad}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    >
      {data && imageLoaded && (
        <Source type="geojson" data={data} generateId key={renderPins ? "symbol-source" : "circle-source"}>
          {
            (renderPins) ? (
              <Layer type="symbol" id="data-pin"
                layout={{
                  "icon-allow-overlap": true,
                  "icon-image": "pin",
                  "icon-size": 0.69,
                  "icon-offset": [0, -25],
                  "symbol-sort-key": [
                    "case",
                    ["==", ["id"], hoveredPointId ?? null], 2,
                    ["==", ["id"], selectedPoint?.id ?? null], 1,
                    0
                  ]
                }}
                paint={{
                  "icon-color": [
                    "case",
                    ["==", ["id"], hoveredPointId ?? null], "#64748b",
                    ["==", ["id"], selectedPoint?.id ?? null], "#64748b",
                    "#020617"
                  ]
                }}
              />
            ) : (
              <Layer type="circle" id="data-point"
                layout={{
                  "circle-sort-key": [
                    "case",
                    ["==", ["id"], hoveredPointId ?? null], 2,
                    ["==", ["id"], selectedPoint?.id ?? null], 1,
                    0
                  ]
                }}
                paint={{
                  "circle-radius": 5,
                  "circle-color": [
                    "case",
                    ["==", ["id"], hoveredPointId ?? null], "#64748b",
                    ["==", ["id"], selectedPoint?.id ?? null], "#64748b",
                    "#020617"
                  ]                    
                }}
              />
            )
          }  
        </Source>
      )}
      {data && selectedPoint && (
        <Popup longitude={selectedPoint.geometry.coordinates[0]} latitude={selectedPoint.geometry.coordinates[1]}
          className="text-xl text-slate-950 break-all"
          onClose={() => setSelectedPoint(undefined)}
          closeOnClick={false}
          offset={(renderPins) ? {
            "bottom": [0, -36],
            "left": [14, -23],
            "right": [-14, -23],
            "bottom-left": [0, -36],
            "bottom-right": [0, -36],
          } : 4}
        >
          <h2 className="font-bold text-slate-700 text-center">
            Properties
          </h2>
          <ul>
            {Object.entries(selectedPoint.properties ?? {}).map(([name, property]) => (
              <li key={name} className="text-sm">
                <span className="text-slate-700 font-bold">
                  {name}:{' '}
                </span>
                <span className="text-slate-500">
                  {property}
                </span>
              </li>
            ))}
          </ul>
        </Popup>
      )}
      <MapControls 
        renderPins={renderPins} 
        toggleRenderPins={() => setRenderPins(r => !r)}
        />
      <NavigationControl />
    </ReactMapGL>
  );
}