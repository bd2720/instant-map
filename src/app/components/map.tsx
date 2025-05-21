"use client";

import ReactMapGL, { type MapRef, type MapMouseEvent, type ErrorEvent, Source, Layer, Popup, NavigationControl } from 'react-map-gl/maplibre';
import { Feature, FeatureCollection, Point } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import { usePinImages } from '../hooks/usePinImages';
import MapControls from './map-controls';
import { type Offset } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  data: FeatureCollection<Point> | null
  mapLoaded: boolean
  mapError: string
  onLoad: () => void
  onError: (e: ErrorEvent) => void
}

export default function Map({ data, mapLoaded, mapError, onLoad, onError }: MapProps){
  const mapRef = useRef<MapRef>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | number | undefined>();
  const [selectedPoint, setSelectedPoint] = useState<Feature<Point>>();
  const [renderPins, setRenderPins] = useState(false);
  
  // load pin image in custom hook
  const imagesLoaded = usePinImages(mapRef, mapLoaded);

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
    setSelectedPoint(clickedPoint);
  }

  // render error message on map error
  if(mapError){
    console.error(mapError);
    return (
      <div className="bg-slate-500 w-full h-full pt-40 text-center flex flex-col items-center">
        <h2 className="font-bold text-4xl text-red-300">MAP ERROR</h2>
        <p className="text-2xl text-red-100 w-1/2">{mapError}</p>
      </div>
    );
  }
  
  return (
    <ReactMapGL
      ref={mapRef}
      style={{width: "100%", height: "100%"}}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
      projection="mercator"
      initialViewState={{
        longitude: -73.267,
        latitude: 41.102,
        zoom: 8.5,
      }}
      maxPitch={0}
      cooperativeGestures={true}
      hash
      attributionControl={{
        compact: true,
        customAttribution: "Geocoding by Geoapify"
      }}
      interactiveLayerIds={["data-pin", "data-point"]}
      cursor={(hoveredPointId !== undefined) ? 'pointer' : undefined}
      onLoad={onLoad}
      onError={onError}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    >
      {data && imagesLoaded && (
        <Source type="geojson" data={data} generateId key={renderPins ? "symbol-source" : "circle-source"}>
          {(renderPins) ? (
            <Layer type="symbol" id="data-pin"
              layout={{
                "icon-allow-overlap": true,
                "icon-image": [
                  "case",
                  ["==", ["id"], hoveredPointId ?? ""], "pin-light",
                  ["==", ["id"], selectedPoint?.id ?? ""], "pin-light",
                  "pin-dark"
                ],
                "icon-size": 0.69,
                "icon-offset": [0, -25],
                "symbol-sort-key": [
                  "case",
                  ["==", ["id"], hoveredPointId ?? ""], 2,
                  ["==", ["id"], selectedPoint?.id ?? ""], 1,
                  0
                ]
              }}
            />
          ) : (
            <Layer type="circle" id="data-point"
              layout={{
                "circle-sort-key": [
                  "case",
                  ["==", ["id"], hoveredPointId ?? ""], 2,
                  ["==", ["id"], selectedPoint?.id ?? ""], 1,
                  0
                ]
              }}
              paint={{
                "circle-radius": 5,
                "circle-color": [
                  "case",
                  ["==", ["id"], hoveredPointId ?? ""], "#64748b",
                  ["==", ["id"], selectedPoint?.id ?? ""], "#64748b",
                  "#020617"
                ]                    
              }}
            />
          )}  
        </Source>
      )}
      {data && selectedPoint && (
        <Popup longitude={selectedPoint.geometry.coordinates[0]} latitude={selectedPoint.geometry.coordinates[1]}
          className="text-xl text-slate-950 wrap-break-word"
          onClose={() => setSelectedPoint(undefined)}
          closeOnClick={false}
          offset={(renderPins) ? {
            "bottom": [0, -36],
            "left": [14, -23],
            "right": [-14, -23],
            "bottom-left": [0, -36],
            "bottom-right": [0, -36],
          } as Offset: 4}
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